import base64
import io
import math
import os
import random
from typing import Any

os.environ.setdefault("MPLCONFIGDIR", os.path.join(os.path.dirname(__file__), ".mplconfig"))

from flask import Flask, render_template, request, session
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

from star_catalog import CONSTELLATION_REGIONS, get_constellation_region


app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-key-change-me"


def star_size_from_magnitude(magnitude: float) -> float:
    brightness = max(0.3, 5.5 - magnitude)
    return 18 * (brightness**1.75)


def get_named_bright_stars(region: dict[str, Any]) -> list[dict[str, Any]]:
    return [star for star in region["stars"] if star["name_cn"] and star["mag"] <= 2.5]


def project_region(region: dict[str, Any], stars: list[dict[str, Any]]) -> dict[str, tuple[float, float]]:
    ra0 = (region["bounds"]["ra_min"] + region["bounds"]["ra_max"]) / 2
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
        y = k * (math.cos(dec0_rad) * math.sin(dec_rad) - math.sin(dec0_rad) * math.cos(dec_rad) * math.cos(ra_rad - ra0_rad))
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
    eligible_regions = [
        key for key, region in CONSTELLATION_REGIONS.items() if len(get_named_bright_stars(region)) >= 4
    ]
    region_key = random.choice(eligible_regions)
    region = get_constellation_region(region_key)
    named_candidates = get_named_bright_stars(region)
    missing_star = random.choice(named_candidates)

    distractors = [star["name_cn"] for star in named_candidates if star["id"] != missing_star["id"]]
    random.shuffle(distractors)
    options = distractors[:3] + [missing_star["name_cn"]]
    random.shuffle(options)

    return {
        "region_key": region_key,
        "missing_star_id": missing_star["id"],
        "missing_star_name": missing_star["name_cn"],
        "options": options,
    }


def render_chart(round_data: dict[str, Any], reveal_missing: bool = False) -> str:
    region = get_constellation_region(round_data["region_key"])
    missing_id = round_data["missing_star_id"]

    fig, ax = plt.subplots(figsize=(6.2, 6.2), facecolor="#07111f")
    ax.set_facecolor("#07111f")

    stars = sorted(region["stars"], key=lambda star: star["mag"], reverse=True)
    star_map = {star["id"]: star for star in stars}
    proj = project_region(region, stars)
    ra0 = (region["bounds"]["ra_min"] + region["bounds"]["ra_max"]) / 2
    dec0 = (region["bounds"]["dec_min"] + region["bounds"]["dec_max"]) / 2
    x_min, x_max, y_min, y_max = projected_bounds(region, ra0, dec0)
    pad = max((x_max - x_min), (y_max - y_min)) * 0.06 or 0.05
    ax.set_xlim(x_min - pad, x_max + pad)
    ax.set_ylim(y_min - pad, y_max + pad)
    ax.set_aspect("equal", adjustable="box")
    add_ra_dec_grid(ax, region, ra0, dec0, (x_min, x_max, y_min, y_max))

    # soft glow for bright stars
    for star in stars:
        if star["id"] == missing_id:
            continue
        if star["mag"] <= 1.5:
            x, y = proj[star["id"]]
            ax.scatter(
                x,
                y,
                s=star_size_from_magnitude(star["mag"]) * 4.2,
                c=star["color"],
                alpha=0.10,
                edgecolors="none",
                zorder=2,
            )
    for star in stars:
        if star["id"] == missing_id:
            continue
        x, y = proj[star["id"]]
        alpha = 0.92 if star["mag"] <= 2.0 else 0.72 if star["mag"] <= 3.0 else 0.55
        ax.scatter(
            x,
            y,
            s=star_size_from_magnitude(star["mag"]),
            c=star["color"],
            alpha=alpha,
            edgecolors="white",
            linewidths=0.16,
            zorder=3,
        )

    for start_id, end_id in region["lines"]:
        if missing_id in {start_id, end_id}:
            continue
        start = star_map.get(start_id)
        end = star_map.get(end_id)
        if start and end:
            x0, y0 = proj[start_id]
            x1, y1 = proj[end_id]
            ax.plot(
                [x0, x1],
                [y0, y1],
                color="#8fb8ff",
                alpha=0.22,
                linewidth=0.72,
                zorder=2,
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


@app.route("/", methods=["GET"])
def index():
    round_data = build_round()
    session["round_data"] = round_data
    region = get_constellation_region(round_data["region_key"])
    chart = render_chart(round_data)
    return render_template(
        "index.html",
        chart_data=chart,
        options=round_data["options"],
        region_name=region["display_name_cn"],
    )


@app.route("/answer", methods=["POST"])
def answer():
    round_data = session.get("round_data")
    if not round_data:
        return render_template("error.html"), 400

    selected = request.form.get("answer", "")
    region = get_constellation_region(round_data["region_key"])
    chart = render_chart(round_data, reveal_missing=True)
    is_correct = selected == round_data["missing_star_name"]

    return render_template(
        "result.html",
        chart_data=chart,
        options=round_data["options"],
        selected=selected,
        answer=round_data["missing_star_name"],
        is_correct=is_correct,
        region_name=region["display_name_cn"],
    )


if __name__ == "__main__":
    app.run(debug=True)
