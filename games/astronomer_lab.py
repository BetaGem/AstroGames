import json
from pathlib import Path

from flask import Blueprint, render_template


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
blueprint = Blueprint("astronomer_lab", __name__, url_prefix="/games/astronomer-lab")

GAME_INFO = {
    "slug": "astronomer-lab",
    "title": "天文工作室",
    "tagline": "难度：★★★",
    "description": "化身科学家，从观测数据读出宇宙奥秘。",
    "status": "live",
    "badge": "新游戏",
    "available": True,
    "endpoint": "astronomer_lab.index",
}


@blueprint.route("/", methods=["GET"])
def index():
    return render_template("games/astronomer_lab/index.html")


@blueprint.route("/hr-data", methods=["GET"])
def hr_data():
    points = []
    with (DATA_DIR / "HR-diagram.txt").open("r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 2:
                points.append({"x": float(parts[0]), "y": float(parts[1])})
    return {"points": points}


@blueprint.route("/isochrone", methods=["GET"])
def isochrone():
    points = []
    with (DATA_DIR / "isochrone.txt").open("r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) >= 2:
                points.append({"x": float(parts[0]), "y": float(parts[1])})
    return {"points": points}
