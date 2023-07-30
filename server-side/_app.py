from http import HTTPStatus

from dotenv import load_dotenv
from flask import jsonify

from core import WebServerEngine, jsonAdapter
from core.utils import transform
from manage import data, volume

load_dotenv()

app = WebServerEngine(__name__)


@app.route("/")
def index():
    return "<h1>Hello World</h1>"


@app.route("/volumes")
def get_volumes_dir():
    res = jsonify(jsonAdapter.export(("name", volume.get_repositories())))
    res.status_code = HTTPStatus.OK
    return res


@app.route("/repository/<string:id>")
def repositorty(id: str):
    if id in volume.get_repositories():
        repo_path = data.handle_repository(id)
        res = jsonify({"id": id, "dirname": repo_path, "info": transform(repo_path)})
        res.status_code = HTTPStatus.OK
        return res

    res = jsonify({"message": "not found"})
    res.status_code = HTTPStatus.NOT_FOUND
    return res
