import os

from dotenv import load_dotenv
from flask import jsonify

from core import *

load_dotenv()

repo_finder = DirDataFinderByPath(
    str(os.getenv("BASE_VOLUME")), str(os.getenv("FOLDER_REPOSITORY_FORMAT"))
)

app = WebServerEngine(__name__)


@app.route("/")
def index():
    return "<h1>Hello World</h1>"


@app.route("/volumes")
def get_volumes_dir():
    return jsonify(jsonAdapter.export(("name", repo_finder.find())))


if __name__ == "__main__":
    app.run(
        host=str(os.getenv("HOST")),
        port=int(os.getenv("PORT")),
        debug=bool(os.getenv("DEBUG")),
    )
