import os
import time
from http import HTTPStatus
from typing import Dict, List
import json

from celery import Celery
from dotenv import load_dotenv
from flask import jsonify, send_file, request
from flask_cors import CORS

from core import WebServerEngine, jsonAdapter
from core.utils import handle_repo_stat_val_test, transform
from manage import conn, data, volume

load_dotenv()

cur = conn.cursor()

app = WebServerEngine(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

CORS(app, origins="*")

celery.conf.update(app.config)


@app.route("/", methods=["GET"])
def index():
    return "<h1>Welcome to LLinpay Framework</h1>"


@app.route("/volumes")
def get_volumes_dir():
    res = jsonify(jsonAdapter.export(("name", volume.get_repositories())))
    res.status_code = HTTPStatus.OK
    return res


@app.route("/repository/<string:id>", methods=["GET"])
def repository(id: str):
    if id in volume.get_repositories():
        query = "SELECT * FROM station_info WHERE id_repository = %s;"
        vals = (id,)
        cur.execute(query, vals)
        row = cur.fetchone()

        if row:
            res = jsonify(json.loads(row[2]))
            res.status_code = HTTPStatus.OK
            return res

        repo_path, vars = data.handle_repository(id)
        res_dict = {
            "id": id,
            "dirname": repo_path,
            "vars": jsonAdapter.export(("name", vars)),
            "info": transform(repo_path),
        }

        station_inf = json.dumps(res_dict)
        query = "INSERT INTO station_info (id_repository, json_info) VALUES (%s, %s);"
        vals = (id, station_inf)
        cur.execute(query, vals)
        conn.commit()

        res = jsonify(res_dict)
        res.status_code = HTTPStatus.OK
        return res

    res = jsonify({"message": "not found"})
    res.status_code = HTTPStatus.NOT_FOUND
    return res


@celery.task()
def enqueue_task(req: List[str], id_file: str):
    res = handle_repo_stat_val_test(volume.get_path_base_dir(), req)

    query = "UPDATE repo_val_mem SET method_fill = %s, p_value = %s, trend = %s, path_out = %s, status_task = %s WHERE id_rep_val = %s;"
    vals = (res["method"], res["p-value"], res["trend"], res["path"], True, id_file)
    cur.execute(query, vals)
    conn.commit()

    return f"{req[0]} -> OK"


@app.route("/var_station/<string:repo_stat_id>", methods=["GET"])
def get_repo_var(repo_stat_id: str):
    req = repo_stat_id.split("&")
    id_file = f"{req[0]}_{req[1]}_{req[2]}.csv"

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

        task = enqueue_task.delay(req, id_file)

        query = "INSERT INTO repo_val_mem (id_task_redis, id_rep_val) VALUES (%s, %s);"
        vals = (task.id, id_file)
        cur.execute(query, vals)
        conn.commit()

        res_dict = {"id": task.id, "status": "Scheduled", "status_task": False}

        res = jsonify(res_dict)
        res.status_code = HTTPStatus.OK
           
        return res

    res_dict = {"id": -1, "message": f"{req[0]} is not a repository"}

    res = jsonify(res_dict)
    res.status_code = HTTPStatus.NOT_FOUND

    return res

@app.route("/get_csv", methods=["GET"])
def get_csv_t():
    if not request.is_json:
        res = jsonify({
           "error": "Data NOT found"
        })
        res.status_code = HTTPStatus.NOT_FOUND

        return res 
    
    data = request.json 
    iFile = data.get("path")
    
    return send_file(iFile, as_attachment=True) 


@app.route("/get_csv_test", methods=["GET"])
def get_test():
    iFile = "/media/lmoroco/D2/5TO/TDS/LlinpayTime/server-side/volume/air-quality-madrid/load/air-quality-madrid_28079004_PM10.csv"
    return send_file(iFile, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=False)