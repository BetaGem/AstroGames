from flask import Flask

from .missing_star import GAME_INFO as MISSING_STAR_INFO
from .missing_star import blueprint as missing_star_blueprint


GAME_CATALOG = [
    MISSING_STAR_INFO,
    {
        "slug": "planet-post",
        "title": "行星排位赛",
        "tagline": "把行星按线索排回正确轨道。",
        "description": "从温度、大小和公转周期里找出每颗行星的位置，训练你的太阳系直觉。",
        "status": "locked",
        "badge": "未解锁",
        "available": False,
    },
    {
        "slug": "nebula-hunt",
        "title": "星云寻迹",
        "tagline": "在深空图像里找到真正的目标。",
        "description": "用颜色、结构和邻近天体信息，辨认出隐藏在深空背景中的星云与星团。",
        "status": "locked",
        "badge": "未解锁",
        "available": False,
    },
    {
        "slug": "timekeeper",
        "title": "观星计时员",
        "tagline": "根据季节与时刻判断天空布局。",
        "description": "把地球自转、公转和星空位置联系起来，挑战不同纬度下的夜空判断题。",
        "status": "locked",
        "badge": "敬请期待",
        "available": False,
    },
]


def register_games(app: Flask) -> None:
    app.register_blueprint(missing_star_blueprint)
