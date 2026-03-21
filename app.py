import base64
import io
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
    return 28 * (brightness**1.9)


def get_named_bright_stars(region: dict[str, Any]) -> list[dict[str, Any]]:
    return [star for star in region["stars"] if star["name_cn"] and star["mag"] <= 2.5]


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

    fig, ax = plt.subplots(figsize=(8, 8), facecolor="#07111f")
    ax.set_facecolor("#07111f")

    stars = sorted(region["stars"], key=lambda star: star["mag"], reverse=True)
    star_map = {star["id"]: star for star in stars}
    for star in stars:
        if star["id"] == missing_id:
            continue
        ax.scatter(
            star["ra"],
            star["dec"],
            s=star_size_from_magnitude(star["mag"]),
            c=star["color"],
            alpha=0.96,
            edgecolors="white",
            linewidths=0.18,
            zorder=3,
        )

    for start_id, end_id in region["lines"]:
        if missing_id in {start_id, end_id}:
            continue
        start = star_map.get(start_id)
        end = star_map.get(end_id)
        if start and end:
            ax.plot(
                [start["ra"], end["ra"]],
                [start["dec"], end["dec"]],
                color="#8fb8ff",
                alpha=0.22,
                linewidth=0.8,
                zorder=2,
            )

    if reveal_missing:
        missing_star = star_map.get(missing_id)
        if missing_star:
            ax.scatter(
                missing_star["ra"],
                missing_star["dec"],
                s=star_size_from_magnitude(missing_star["mag"]) * 1.4,
                c=missing_star["color"],
                alpha=0.98,
                edgecolors="#ffe28a",
                linewidths=1.2,
                zorder=4,
            )
            ax.scatter(
                missing_star["ra"],
                missing_star["dec"],
                s=star_size_from_magnitude(missing_star["mag"]) * 3.2,
                facecolors="none",
                edgecolors="#ffe28a",
                linewidths=1.0,
                alpha=0.7,
                zorder=4,
            )
            ax.text(
                missing_star["ra"],
                missing_star["dec"] + 1.0,
                star_map[missing_id]["name_en"] or "Missing star",
                color="#ffe28a",
                fontsize=10,
                ha="center",
                va="bottom",
                zorder=5,
            )

    ax.set_xlim(region["bounds"]["ra_max"], region["bounds"]["ra_min"])
    ax.set_ylim(region["bounds"]["dec_min"], region["bounds"]["dec_max"])
    ax.grid(color="white", alpha=0.08, linestyle="--", linewidth=0.5)
    ax.set_xlabel("Right Ascension", color="#dce8ff")
    ax.set_ylabel("Declination", color="#dce8ff")
    ax.tick_params(colors="#dce8ff")
    for spine in ax.spines.values():
        spine.set_color("#7ca1d9")
        spine.set_alpha(0.3)

    ax.set_title(
        f"{region['display_name_en']} Region\nOne named bright star is missing",
        color="white",
        fontsize=16,
        pad=16,
    )

    buffer = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buffer, format="png", dpi=160, facecolor=fig.get_facecolor(), bbox_inches="tight")
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
