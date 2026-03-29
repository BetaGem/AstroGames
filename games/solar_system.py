from flask import Blueprint, render_template


blueprint = Blueprint("solar_system", __name__, url_prefix="/games/solar-system")

GAME_INFO = {
    "slug": "solar-system",
    "title": "认识太阳系",
    "tagline": "难度：★☆☆☆☆",
    "description": "太阳系基础知识小测验。快来试试你对太阳系的了解程度吧！",
    "status": "live",
    "badge": "已解锁",
    "available": True,
    "endpoint": "solar_system.index",
}


@blueprint.route("/", methods=["GET"])
def index():
    return render_template("games/solar_system/index.html")
