from http import HTTPStatus
from typing import List
import json
import os
import pandas as pd

from celery import Celery
from dotenv import load_dotenv
from flask import jsonify, send_file, request
from flask_cors import CORS

from core import WebServerEngine, jsonAdapter
from core.utils import handle_repo_stat_val_test, transform, load_csv
from manage import conn, data, volume

from sklearn.impute import SimpleImputer

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


@app.route("/nan_info/<string:id>", methods=["GET"])
def nan_distribut(id: str):
    query = "SELECT * FROM nan_distribution WHERE station = %s;"
    vals = (id,)
    cur.execute(query, vals)
    row = cur.fetchone()

    if row:
        res = jsonify(json.loads(row[2]))
        res.status_code = HTTPStatus.OK
        return res

    path = volume.get_path_base_dir()
    path = os.path.join(path, "air-quality-madrid",
                        "input", "data", f"{id}.csv")

    df = pd.read_csv(path, parse_dates=["date"])
    grouped = df.groupby(df['date'].dt.year).apply(lambda x: x.isna().sum())

    resu = {'identifier': f"{id}", 'nan_counts': []}
    for col in df.columns[1:]:
        nan_counts = grouped[col]
        if not all(nan_counts == len(df)):
            col_nan_counts = [{'year': year, 'nan_count': nan_count}
                              for year, nan_count in zip(grouped.index, nan_counts)]
            resu['nan_counts'].append(
                {'variable': col, 'nan_counts_by_year': col_nan_counts})

    info = json.dumps(resu)
    query = "INSERT INTO nan_distribution (station, info) VALUES (%s, %s);"
    vals = (id, info)
    cur.execute(query, vals)
    conn.commit()

    res = jsonify(resu)
    res.status_code = HTTPStatus.OK

    return res


@app.route("/volumes", methods=["GET"])
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

    query = "UPDATE repo_val_mem SET method_fill = %s, p_value = %s, trend = %s, path_out = %s, status_task = %s, from_t = %s, to_d = %s WHERE id_rep_val = %s;"
    vals = (res["method"], res["p-value"], res["trend"],
            res["path"], True, res["from_d"], res["to_d"], id_file)
    cur.execute(query, vals)
    conn.commit()

    return f"{req[0]} with {req[1]} preprocessed -> OK"


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
                "info": {
                    "id": row[0],
                    "id_task_redis": row[1],
                    "id_rep_val": row[2],
                    "method_fill": row[3],
                    "p_value": row[4],
                    "trend": row[5],
                    "path_out": row[6],
                    "status_task": row[7],
                    "from_d": row[8],
                    "to_d": row[9],
                },
                "state": row[7]
            }

            res = jsonify(res_dict)
            res.status_code = HTTPStatus.OK

            return res

        task = enqueue_task.delay(req, id_file)

        query = "INSERT INTO repo_val_mem (id_task_redis, id_rep_val) VALUES (%s, %s);"
        vals = (task.id, id_file)
        cur.execute(query, vals)
        conn.commit()

        res_dict = {
            "info": {
                "id": task.id,
                "status": "Scheduled",
                "status_task": False
            },
            "state": False
        }

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
        res = jsonify({"error": "Data NOT found"})
        res.status_code = HTTPStatus.NOT_FOUND
        return res

    data = request.json
    iFile = data.get("path")

    return send_file(iFile, as_attachment=True)


@app.route("/get_csv_test", methods=["GET"])
def get_test():
    file = (
        "/media/lmoroco/D/5TO/TDS/LlinpayTime/server-side/volume/air-quality-madrid/load/air-quality"
        "-madrid_28079004_PM10.csv"
    )
    return send_file(file, as_attachment=True)

@app.route("/impute/<string:path_name_imp>", methods=["GET"])
def get_imputation(path: str):
    req = path.split("$")
    df = pd.read_csv(req[0])
    df['missing'] = df[req[1]].apply(lambda x: 0 if pd.isna(x) else 1)


if __name__ == "__main__":
    app.run(debug=False)
