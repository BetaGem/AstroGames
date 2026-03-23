import base64
import io
import json
import math
import random
from functools import lru_cache
from pathlib import Path
from typing import Any

from flask import Blueprint, redirect, render_template, request, session, url_for
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

from star_catalog import (
    CONSTELLATION_REGIONS,
    get_constellation_line_segments,
    get_constellation_region,
    get_region_center_ra,
    get_region_stars,
)


blueprint = Blueprint("missing_star", __name__, url_prefix="/games/missing-star")

GAME_INFO = {
    "slug": "missing-star",
    "title": "消失的恒星",
    "tagline": "从残缺的星座里找回那颗消失的星。",
    "description": "观察星座轮廓、亮星位置和连线关系，猜出被藏起来的恒星。",
    "status": "live",
    "badge": "已解锁",
    "available": True,
    "endpoint": "missing_star.index",
}

STAR_KNOWLEDGE_FILE = Path(__file__).resolve().parent.parent.joinpath("data", "star_knowledge.json")
DEFAULT_KNOWLEDGE_TEXT = "这颗星的讲解员正在天上赶路，稍后再来吧～"

# Maximum magnitude allowed for the missing correct answer star.
MISSING_STAR_MAX_MAG = 2.0
# Answer options may include named stars this mag fainter.
OPTION_STAR_MAG_OFFSET = 1.0
# The UI does not allow difficulty above this magnitude yet.
MAX_ALLOWED_DIFFICULTY = 4.0
# Missing stars south of this declination are excluded from random selection.
MIN_SELECTION_DEC_DEG = -40.0

RECENT_STAR_HISTORY_LIMIT = 10
RECENT_REGION_HISTORY_LIMIT = 10

ROUND_KEY = "missing_star_round_data"
RESULT_KEY = "missing_star_result_data"
DIFFICULTY_KEY = "missing_star_missing_star_max_mag"
LINES_KEY = "missing_star_show_constellation_lines"
STAR_HISTORY_KEY = "missing_star_recent_star_ids"
REGION_HISTORY_KEY = "missing_star_recent_region_keys"
ERROR_KEY = "missing_star_difficulty_error"


def star_size_from_magnitude(magnitude: float) -> float:
    brightness = max(0.3, 5.5 - magnitude)
    return 13 * (brightness**1.68)


def get_named_bright_stars(region: dict[str, Any], max_mag: float) -> list[dict[str, Any]]:
    return [
        star
        for star in region["stars"]
        if star["name_cn"] and star["mag"] <= max_mag and star["dec"] >= MIN_SELECTION_DEC_DEG
    ]


def get_all_named_star_names(max_mag: float) -> list[str]:
    names = {
        star["name_cn"]
        for region in CONSTELLATION_REGIONS.values()
        for star in region["stars"]
        if star.get("name_cn") and star["mag"] <= max_mag
    }
    return sorted(names)


def get_current_difficulty() -> float:
    return float(session.get(DIFFICULTY_KEY, MISSING_STAR_MAX_MAG))


def get_show_constellation_lines() -> bool:
    return bool(session.get(LINES_KEY, True))


@lru_cache(maxsize=1)
def load_star_knowledge() -> dict[str, str]:
    if not STAR_KNOWLEDGE_FILE.exists():
        return {}
    with STAR_KNOWLEDGE_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)
    return {key: value for key, value in data.items() if not key.startswith("_") and isinstance(value, str)}


def get_recent_history() -> tuple[list[str], list[str]]:
    return list(session.get(STAR_HISTORY_KEY, [])), list(session.get(REGION_HISTORY_KEY, []))


def update_recent_history(region_key: str, missing_star_id: str) -> None:
    recent_star_ids, recent_region_keys = get_recent_history()
    recent_star_ids.append(missing_star_id)
    recent_region_keys.append(region_key)
    session[STAR_HISTORY_KEY] = recent_star_ids[-RECENT_STAR_HISTORY_LIMIT:]
    session[REGION_HISTORY_KEY] = recent_region_keys[-RECENT_REGION_HISTORY_LIMIT:]


def project_region(region: dict[str, Any], stars: list[dict[str, Any]]) -> dict[str, tuple[float, float]]:
    ra0 = get_region_center_ra(region["bounds"])
    dec0 = (region["bounds"]["dec_min"] + region["bounds"]["dec_max"]) / 2
    ra0_rad = math.radians(ra0)
    dec0_rad = math.radians(dec0)

    projected: dict[str, tuple[float, float]] = {}
    for star in stars:
        ra_rad = math.radians(star["ra"])
        dec_rad = math.radians(star["dec"])
        cos_c = math.sin(dec0_rad) * math.sin(dec_rad) + math.cos(dec0_rad) * math.cos(dec_rad) * math.cos(
            ra_rad - ra0_rad
        )
        k = 2 / (1 + cos_c)
        x = k * math.cos(dec_rad) * math.sin(ra_rad - ra0_rad)
        y = k * (
            math.cos(dec0_rad) * math.sin(dec_rad)
            - math.sin(dec0_rad) * math.cos(dec_rad) * math.cos(ra_rad - ra0_rad)
        )
        projected[star["id"]] = (-x, y)

    return projected


def project_point(ra: float, dec: float, ra0: float, dec0: float) -> tuple[float, float]:
    ra_rad = math.radians(ra)
    dec_rad = math.radians(dec)
    ra0_rad = math.radians(ra0)
    dec0_rad = math.radians(dec0)
    cos_c = math.sin(dec0_rad) * math.sin(dec_rad) + math.cos(dec0_rad) * math.cos(dec_rad) * math.cos(
        ra_rad - ra0_rad
    )
    k = 2 / (1 + cos_c)
    x = k * math.cos(dec_rad) * math.sin(ra_rad - ra0_rad)
    y = k * (math.cos(dec0_rad) * math.sin(dec_rad) - math.sin(dec0_rad) * math.cos(dec_rad) * math.cos(ra_rad - ra0_rad))
    return (-x, y)


def add_ra_dec_grid(
    ax: Any,
    region: dict[str, Any],
    ra0: float,
    dec0: float,
    bounds: tuple[float, float, float, float],
) -> None:
    ra_min = region["bounds"]["ra_min"]
    ra_max = region["bounds"]["ra_max"]
    dec_min = region["bounds"]["dec_min"]
    dec_max = region["bounds"]["dec_max"]
    x_min, x_max, y_min, y_max = bounds
    inset = max((x_max - x_min), (y_max - y_min)) * 0.02

    ra_ticks = [round(val, 1) for val in _linspace(ra_min, ra_max, 4)]
    dec_ticks = [round(val, 1) for val in _linspace(dec_min, dec_max, 4)]

    for ra in ra_ticks:
        xs = []
        ys = []
        for dec in _linspace(dec_min, dec_max, 80):
            x, y = project_point(ra, dec, ra0, dec0)
            xs.append(x)
            ys.append(y)
        ax.plot(xs, ys, color="white", alpha=0.06, linewidth=0.6, zorder=1)
        lx = min(max(xs[len(xs) // 2], x_min + inset), x_max - inset)
        ly = min(max(ys[len(ys) // 2], y_min + inset), y_max - inset)
        ax.text(
            lx,
            ly,
            f"{ra:.1f}°",
            color="#8aa6c7",
            fontsize=8,
            ha="center",
            va="center",
            zorder=2,
            clip_on=True,
        )

    for dec in dec_ticks:
        xs = []
        ys = []
        for ra in _linspace(ra_min, ra_max, 80):
            x, y = project_point(ra, dec, ra0, dec0)
            xs.append(x)
            ys.append(y)
        ax.plot(xs, ys, color="white", alpha=0.06, linewidth=0.6, zorder=1)
        lx = min(max(xs[len(xs) // 2], x_min + inset), x_max - inset)
        ly = min(max(ys[len(ys) // 2], y_min + inset), y_max - inset)
        ax.text(
            lx,
            ly,
            f"{dec:.1f}°",
            color="#8aa6c7",
            fontsize=8,
            ha="center",
            va="center",
            zorder=2,
            clip_on=True,
        )


def _linspace(start: float, end: float, count: int) -> list[float]:
    if count <= 1:
        return [start]
    step = (end - start) / (count - 1)
    return [start + step * i for i in range(count)]


def projected_bounds(region: dict[str, Any], ra0: float, dec0: float) -> tuple[float, float, float, float]:
    ra_min = region["bounds"]["ra_min"]
    ra_max = region["bounds"]["ra_max"]
    dec_min = region["bounds"]["dec_min"]
    dec_max = region["bounds"]["dec_max"]

    xs: list[float] = []
    ys: list[float] = []

    for ra in _linspace(ra_min, ra_max, 80):
        for dec in (dec_min, dec_max):
            x, y = project_point(ra, dec, ra0, dec0)
            xs.append(x)
            ys.append(y)

    for dec in _linspace(dec_min, dec_max, 80):
        for ra in (ra_min, ra_max):
            x, y = project_point(ra, dec, ra0, dec0)
            xs.append(x)
            ys.append(y)

    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)
    return x_min, x_max, y_min, y_max


def build_round() -> dict[str, Any]:
    missing_star_max_mag = get_current_difficulty()
    option_star_max_mag = missing_star_max_mag + OPTION_STAR_MAG_OFFSET
    recent_star_ids, recent_region_keys = get_recent_history()
    eligible_regions = [
        key
        for key, region in CONSTELLATION_REGIONS.items()
        if len(get_named_bright_stars(region, missing_star_max_mag)) >= 1
    ]
    preferred_regions = [key for key in eligible_regions if key not in recent_region_keys]
    region_pool = preferred_regions or eligible_regions
    region_key = random.choice(region_pool)
    region = get_constellation_region(region_key)
    named_candidates = get_named_bright_stars(region, missing_star_max_mag)
    preferred_candidates = [star for star in named_candidates if star["id"] not in recent_star_ids]
    candidate_pool = preferred_candidates or named_candidates
    missing_star = random.choice(candidate_pool)

    distractors = [name for name in get_all_named_star_names(option_star_max_mag) if name != missing_star["name_cn"]]
    random.shuffle(distractors)
    options = distractors[:2] + [missing_star["name_cn"]]
    random.shuffle(options)

    return {
        "region_key": region_key,
        "missing_star_id": missing_star["id"],
        "missing_star_name": missing_star["name_cn"],
        "options": options,
        "missing_star_max_mag": missing_star_max_mag,
        "option_star_max_mag": option_star_max_mag,
    }


def get_or_create_round(force_new: bool = False) -> dict[str, Any]:
    if not force_new:
        round_data = session.get(ROUND_KEY)
        if round_data:
            return round_data

    round_data = build_round()
    session[ROUND_KEY] = round_data
    update_recent_history(round_data["region_key"], round_data["missing_star_id"])
    return round_data


def add_constellation_lines(
    ax: Any,
    region_key: str,
    star_map: dict[str, dict[str, Any]],
    projected: dict[str, tuple[float, float]],
) -> None:
    hip_to_star = {star.get("hip", ""): star for star in star_map.values()}

    for start_hip, end_hip in get_constellation_line_segments(region_key):
        start_star = hip_to_star.get(start_hip)
        end_star = hip_to_star.get(end_hip)
        if not start_star or not end_star:
            continue

        start_pos = projected.get(start_star["id"])
        end_pos = projected.get(end_star["id"])
        if not start_pos or not end_pos:
            continue

        ax.plot(
            [start_pos[0], end_pos[0]],
            [start_pos[1], end_pos[1]],
            color="#8fb6ff",
            alpha=0.34,
            linewidth=1.15,
            solid_capstyle="round",
            zorder=2.4,
        )


def render_chart(round_data: dict[str, Any], reveal_missing: bool = False, show_constellation_lines: bool = False) -> str:
    region = get_constellation_region(round_data["region_key"])
    missing_id = round_data["missing_star_id"]

    fig, ax = plt.subplots(figsize=(6.2, 6.2), facecolor="#07111f")
    ax.set_facecolor("#07111f")

    stars = sorted(get_region_stars(round_data["region_key"]), key=lambda star: star["mag"], reverse=True)
    star_map = {star["id"]: star for star in stars}
    proj = project_region(region, stars)
    ra0 = get_region_center_ra(region["bounds"])
    dec0 = (region["bounds"]["dec_min"] + region["bounds"]["dec_max"]) / 2
    x_min, x_max, y_min, y_max = projected_bounds(region, ra0, dec0)
    pad = max((x_max - x_min), (y_max - y_min)) * 0.06 or 0.05
    ax.set_xlim(x_min - pad, x_max + pad)
    ax.set_ylim(y_min - pad, y_max + pad)
    ax.set_aspect("equal", adjustable="box")
    add_ra_dec_grid(ax, region, ra0, dec0, (x_min, x_max, y_min, y_max))

    if show_constellation_lines:
        add_constellation_lines(ax, round_data["region_key"], star_map, proj)

    for star in stars:
        if star["id"] == missing_id:
            continue
        if star["mag"] <= 1.5:
            x, y = proj[star["id"]]
            ax.scatter(
                x,
                y,
                s=star_size_from_magnitude(star["mag"]) * 5.0,
                c=star["color"],
                alpha=0.16,
                edgecolors="none",
                zorder=2,
            )

    for star in stars:
        if star["id"] == missing_id:
            continue
        x, y = proj[star["id"]]
        alpha = 0.98 if star["mag"] <= 2.0 else 0.84 if star["mag"] <= 3.0 else 0.66
        ax.scatter(
            x,
            y,
            s=star_size_from_magnitude(star["mag"]),
            c=star["color"],
            alpha=alpha,
            edgecolors="white",
            linewidths=0.12,
            zorder=3,
        )

    if reveal_missing:
        missing_star = star_map.get(missing_id)
        if missing_star:
            mx, my = proj[missing_id]
            ax.scatter(
                mx,
                my,
                s=star_size_from_magnitude(missing_star["mag"]) * 1.4,
                c=missing_star["color"],
                alpha=0.98,
                edgecolors="#ffe28a",
                linewidths=1.2,
                zorder=4,
            )
            ax.scatter(
                mx,
                my,
                s=star_size_from_magnitude(missing_star["mag"]) * 3.2,
                facecolors="none",
                edgecolors="#ffe28a",
                linewidths=1.0,
                alpha=0.7,
                zorder=4,
            )
            ax.text(
                mx,
                my + 0.015,
                star_map[missing_id]["name_en"] or "Missing star",
                color="#ffe28a",
                fontsize=9,
                ha="center",
                va="bottom",
                zorder=5,
            )

    ax.tick_params(colors="#dce8ff")
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_color("#7ca1d9")
        spine.set_alpha(0.3)

    buffer = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buffer, format="png", dpi=145, facecolor=fig.get_facecolor(), bbox_inches="tight")
    plt.close(fig)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@blueprint.route("/", methods=["GET"])
def index():
    if request.args.get("reset_lines") == "1":
        session[LINES_KEY] = True
    round_data = get_or_create_round(force_new=request.args.get("new") == "1")
    region = get_constellation_region(round_data["region_key"])
    show_constellation_lines = get_show_constellation_lines()
    chart = render_chart(round_data, show_constellation_lines=show_constellation_lines)
    return render_template(
        "games/missing_star/index.html",
        chart_data=chart,
        options=round_data["options"],
        region_name=region["display_name_cn"],
        current_difficulty=round_data["missing_star_max_mag"],
        difficulty_error=session.pop(ERROR_KEY, ""),
        show_constellation_lines=show_constellation_lines,
    )


@blueprint.route("/difficulty", methods=["POST"])
def set_difficulty():
    raw_value = request.form.get("difficulty", "").strip()
    try:
        difficulty = float(raw_value)
    except ValueError:
        session[ERROR_KEY] = "请输入有效的星等数字。"
        return redirect(url_for("missing_star.index", new=1))

    if difficulty > MAX_ALLOWED_DIFFICULTY:
        session[ERROR_KEY] = "这个难度太高了，开发者还在学习中......"
        return redirect(url_for("missing_star.index", new=1))

    session[DIFFICULTY_KEY] = difficulty
    session.pop(ERROR_KEY, None)
    return redirect(url_for("missing_star.index", new=1))


@blueprint.route("/toggle-lines", methods=["POST"])
def toggle_lines():
    session[LINES_KEY] = not get_show_constellation_lines()
    return redirect(url_for("missing_star.index"))


@blueprint.route("/answer", methods=["POST"])
def answer():
    round_data = session.get(ROUND_KEY)
    if not round_data:
        return render_template("games/missing_star/error.html"), 400

    selected = request.form.get("answer", "")
    if not selected:
        return redirect(url_for("missing_star.index"))

    session[RESULT_KEY] = {
        "selected": selected,
        "round_data": round_data,
    }
    return redirect(url_for("missing_star.result"))


@blueprint.route("/result", methods=["GET"])
def result():
    result_data = session.get(RESULT_KEY)
    if not result_data:
        return redirect(url_for("missing_star.index"))

    round_data = result_data.get("round_data")
    if not round_data:
        return redirect(url_for("missing_star.index"))

    selected = result_data.get("selected", "")
    region = get_constellation_region(round_data["region_key"])
    chart = render_chart(round_data, reveal_missing=True, show_constellation_lines=True)
    is_correct = selected == round_data["missing_star_name"]
    answer_name = round_data["missing_star_name"]
    knowledge_text = load_star_knowledge().get(answer_name, DEFAULT_KNOWLEDGE_TEXT)

    return render_template(
        "games/missing_star/result.html",
        chart_data=chart,
        options=round_data["options"],
        selected=selected,
        answer=answer_name,
        is_correct=is_correct,
        region_name=region["display_name_cn"],
        current_difficulty=round_data.get("missing_star_max_mag", MISSING_STAR_MAX_MAG),
        knowledge_text=knowledge_text,
    )
