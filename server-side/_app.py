import os
import time
from http import HTTPStatus

from celery import Celery
from dotenv import load_dotenv
from flask import jsonify
from flask_cors import CORS

from core import WebServerEngine, jsonAdapter
from core.utils import transform
from manage import conn, data, volume

load_dotenv()

cur = conn.cursor()

app = WebServerEngine(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

CORS(app, origins="*")

celery.conf.update(app.config)


@app.route("/")
def index():
    return "<h1>Welcome to LLinpay Framework</h1>"


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


@celery.task()
def enqueue_task(id_file: str):
    time.sleep(10)
    return f"Task for {id_file} comleted :v"


@app.route("/var_station/<string:repo_stat_id>")
def get_repo_var(repo_stat_id: str):
    req = repo_stat_id.split("$")
    id_file = f"{req[0]}_{req[1]}.csv"

    if req[0] in volume.get_repositories():
        query = "SELECT * FROM repo_val_mem WHERE id_rep_val = %s;"
        vals = (id_file,)
        cur.execute(query, vals)
        row = cur.fetchone()

        if row:
            res_dict = {
                "id": row[0],
                "id_task_redis": row[1],
                "id_rep_val": row[2],
                "method_fill": row[3],
                "p_value": row[4],
                "trend": row[5],
                "path_out": row[6],
                "status_task": row[7],
            }

            res = jsonify(res_dict)
            res.status_code = HTTPStatus.OK

            return res

        task = enqueue_task.delay(id_file)

        query = "INSERT INTO repo_val_mem (id_task_redis, id_rep_val) VALUES (%s, %s);"
        vals = (task.id, id_file)
        cur.execute(query, vals)
        conn.commit()

        res_dict = {"id": task.id, "status": "Scheduled"}

        res = jsonify(res_dict)
        res.status_code = HTTPStatus.OK

        return res

    res_dict = {"id": -1, "message": f"{req[0]} is not a repository"}

    res = jsonify(res)
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
