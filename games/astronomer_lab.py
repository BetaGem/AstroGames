from flask import Blueprint, render_template


blueprint = Blueprint("astronomer_lab", __name__, url_prefix="/games/astronomer-lab")

GAME_INFO = {
    "slug": "astronomer-lab",
    "title": "天文工作室",
    "tagline": "难度：★★",
    "description": "化身科学家，从观测数据读出宇宙奥秘。",
    "status": "live",
    "badge": "新游戏",
    "available": True,
    "endpoint": "astronomer_lab.index",
}


@blueprint.route("/", methods=["GET"])
def index():
    return render_template("games/astronomer_lab/index.html")
