import os

from flask import Flask, render_template

os.environ.setdefault("MPLCONFIGDIR", os.path.join(os.path.dirname(__file__), ".mplconfig"))

from games import GAME_CATALOG, register_games


app = Flask(__name__)
app.config["SECRET_KEY"] = "dev-secret-key-change-me"

register_games(app)


@app.route("/", methods=["GET"])
def home():
    return render_template("home.html", games=GAME_CATALOG)


if __name__ == "__main__":
    app.run(debug=True)
