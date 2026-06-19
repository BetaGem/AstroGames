from flask import Flask

from .astronomer_lab import GAME_INFO as ASTRONOMER_LAB_INFO
from .astronomer_lab import blueprint as astronomer_lab_blueprint
from .missing_star import GAME_INFO as MISSING_STAR_INFO
from .missing_star import blueprint as missing_star_blueprint
from .solar_system import GAME_INFO as SOLAR_SYSTEM_INFO
from .solar_system import blueprint as solar_system_blueprint
from .sky_sudoku import GAME_INFO as SKY_SUDOKU_INFO
from .sky_sudoku import blueprint as sky_sudoku_blueprint


GAME_CATALOG = [
    SOLAR_SYSTEM_INFO,
    MISSING_STAR_INFO,
    SKY_SUDOKU_INFO,
    ASTRONOMER_LAB_INFO,
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
    app.register_blueprint(sky_sudoku_blueprint)
    app.register_blueprint(astronomer_lab_blueprint)
