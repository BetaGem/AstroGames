from flask import Blueprint, render_template, url_for


blueprint = Blueprint("sky_sudoku", __name__, url_prefix="/games/sky-sudoku")

GAME_INFO = {
    "slug": "sky-sudoku",
    "title": "星空数独",
    "tagline": "难度：★★★★★",
    "description": "多波段数独观测计划。",
    "status": "live",
    "badge": "已解锁",
    "available": True,
    "featured": True,
    "endpoint": "sky_sudoku.index",
}


@blueprint.route("/", methods=["GET"])
def index():
    return render_template(
        "games/sky_sudoku/index.html",
        asset_base=url_for("static", filename="images/sky_sudoku/"),
    )
