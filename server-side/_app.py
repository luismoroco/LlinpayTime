import os
from http import HTTPStatus

from dotenv import load_dotenv
from flask import jsonify

from core import WebServerEngine, jsonAdapter
from core.utils import handle_repo_stat_val, transform
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
    print(id)
    if id in volume.get_repositories():
        repo_path, vars = data.handle_repository(id)
        res = jsonify(
            {
                "id": id,
                "dirname": repo_path,
                "vars": jsonAdapter.export(("name", vars)),
                "info": transform(repo_path),
            }
        )
        res.status_code = HTTPStatus.OK
        return res

    res = jsonify({"message": "not found"})
    res.status_code = HTTPStatus.NOT_FOUND
    return res


@app.route("/var_per_station/<string:repo_stat_id>")
def get_var_per_repo(repo_stat_id: str):
    req = repo_stat_id.split("_")
    print(req)

    if req[0] in volume.get_repositories():
        res = jsonify(handle_repo_stat_val(volume.get_path_base_dir(), req))
        res.status_code = HTTPStatus.OK
        return res

    res = jsonify({"message": "not found"})
    res.status_code = HTTPStatus.NOT_FOUND
    return res
