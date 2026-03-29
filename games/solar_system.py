from flask import Blueprint, render_template


blueprint = Blueprint("solar_system", __name__, url_prefix="/games/solar-system")

GAME_INFO = {
    "slug": "solar-system",
    "title": "认识太阳系",
    "tagline": "难度：★☆☆☆☆",
    "description": "先把八大行星按顺序归位，再完成 10 道太阳系小测验。",
    "status": "live",
    "badge": "已解锁",
    "available": True,
    "endpoint": "solar_system.index",
}


@blueprint.route("/", methods=["GET"])
def index():
    return render_template("games/solar_system/index.html")
