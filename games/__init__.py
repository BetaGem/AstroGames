from flask import Flask

from .missing_star import GAME_INFO as MISSING_STAR_INFO
from .missing_star import blueprint as missing_star_blueprint
from .solar_system import GAME_INFO as SOLAR_SYSTEM_INFO
from .solar_system import blueprint as solar_system_blueprint


GAME_CATALOG = [
    SOLAR_SYSTEM_INFO,
    MISSING_STAR_INFO,
    {
        "slug": "coming-soon-2",
        "title": "未解锁内容",
        "tagline": "新的天文小游戏正在准备中。",
        "description": "AstroGames 会继续扩展更多主题和玩法。",
        "status": "locked",
        "badge": "未解锁",
        "available": False,
    },
    {
        "slug": "coming-soon-3",
        "title": "未解锁内容",
        "tagline": "新的天文小游戏正在准备中。",
        "description": "AstroGames 会继续扩展更多主题和玩法。",
        "status": "locked",
        "badge": "未解锁",
        "available": False,
    },
]


def register_games(app: Flask) -> None:
    app.register_blueprint(missing_star_blueprint)
    app.register_blueprint(solar_system_blueprint)
