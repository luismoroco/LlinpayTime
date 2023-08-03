import time

from celery import Celery
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

CORS(app, origins="*")

celery.conf.update(app.config)


@celery.task()
def add(x, y):
    time.sleep(10)
    return x + y


@app.route("/")
def add_task():
    for i in range(5):
        add.delay(i, i + 1)

    return jsonify({"status": "ok"})


# ----------------------------------------------------------

from celery import Celery
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "chobolin"
app_socket = SocketIO(app)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)


@app_socket.on("connect")
def handle_connect():
    print("Client connected")


@app_socket.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@app.route("/")
def hello():
    return "Hello, World!"


@celery.task(bind=True)
def divide(x, y):
    import time

    time.sleep(5)
    return x / y


@app_socket.on("exec fx")
def wait_execute():
    task = divide.apply_async(args=(1, 3))
    task_id = task.id

    task_res = task.get()
    app_socket.emit("res fx", {"id": task_id, "res": task_res})


if __name__ == "__main__":
    app.run(port=5000)


# ----------------------------------------------------------------------------


import time

from celery import Celery
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

CORS(app, origins="*")

celery.conf.update(app.config)

# Configuración de SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")


@celery.task()
def add(x, y):
    time.sleep(5)
    return x + y


@app.route("/")
def add_task():
    task_ids = []
    for i in range(5):
        task = add.delay(i, i + 1)
        task_ids.append(task.id)

    return jsonify({"status": "ok", "task_ids": task_ids})


# Función para verificar el estado de una tarea
def check_task_status(task_id):
    result = celery.AsyncResult(task_id)
    if result.successful():
        return {"status": "completed", "result": result.get()}
    elif result.failed():
        return {"status": "failed", "error": str(result.result)}
    else:
        return {"status": "pending"}


# Ruta para obtener el estado de una tarea usando WebSockets
@socketio.on("get_task_status")
def get_task_status(message):
    task_id = message["task_id"]
    status = check_task_status(task_id)
    emit("task_status", status)


if __name__ == "__main__":
    # Inicia el servidor de Flask con SocketIO
    socketio.run(app)


# ------------------------- ESTABLE ----------------------------- #

import time
from http import HTTPStatus

from celery import Celery
from flask import Flask, jsonify
from flask_cors import CORS

from manage import conn

app = Flask(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

CORS(app, origins="*")

celery.conf.update(app.config)


cur = conn.cursor()


@celery.task()
def add(x, y):
    time.sleep(5)
    return x + y


@celery.task()
def preprocess(repo: str, id: str):
    time.sleep(20)
    query = "UPDATE task_cache SET status_task = %s WHERE id_task = %s;"
    vals = (True, id)
    cur.execute(query, vals)
    conn.commit()
    return f"COMPLETED: {repo}"


@app.route("/enqueue/<string:repo_var>")
def addTask(repo_var: str):
    arr = repo_var.split("_")
    task_id = f"{arr[0]}_{arr[1]}.csv"

    query = "SELECT * FROM task_cache WHERE id_task = %s;"
    vals = (task_id,)
    cur.execute(query, vals)
    row = cur.fetchone()

    if row:
        row_dict = {
            "id": row[0],
            "id_task_redis": row[1],
            "id_task": row[2],
            "status_task": row[3],
        }

        return jsonify(row_dict)

    task = preprocess.delay(repo_var, task_id)

    query = "INSERT INTO task_cache (id_task_redis, id_task) VALUES (%s, %s);"
    vals = (task.id, task_id)
    cur.execute(query, vals)
    conn.commit()

    return jsonify({"id_task": task.id})


@app.route("/query/<string:id>")
def taskIsFinished(id: str):
    query = "SELECT * FROM task_cache WHERE id_task_redis = %s"
    vals = id
    cur.execute(query, vals)
    row = cur.fetchone()

    if row:
        res = jsonify(
            {
                "id": row[0],
                "id_task_redis": row[1],
                "id_task": row[2],
                "status_task": row[3],
            }
        ).status_code = HTTPStatus.OK

        return res

    res = jsonify(
        {"message": "Task ID not found :'v"}
    ).status_code = HTTPStatus.NO_CONTENT

    return res


@app.route("/add")
def add_task():
    for i in range(5):
        add.delay(i, i + 1)

    return jsonify({"status": "ok"})


@app.route("/query/<string:id>")
def query_if_end(id: str):
    res = jsonify({"id": id})
    res.status_code = HTTPStatus.OK
    return res
