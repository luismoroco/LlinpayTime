import time

from celery import Celery
from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "CHIBO_LIN"
app.config["CELERY_BROKER_URL"] = "redis://127.0.0.1:6379"

CORS(app, origins="*")

socketio = SocketIO(app, cors_allowed_origins="*")
celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)
celery.conf.update(app.config)


@celery.task()
def add(x, y):
    time.sleep(5)
    result = x + y
    return {"x": x, "y": y, "result": result}


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("run_tasks")
@cross_origin()
def run_tasks():
    task_ids = []
    for i in range(10):
        task = add.apply_async(args=[i, i])
        task_ids.append(task.id)
    emit("tasks_started", {"task_ids": task_ids}, broadcast=True)


@socketio.on("get_task_result")
@cross_origin()
def get_task_result(task_id):
    result = celery.AsyncResult(task_id)
    if result.state == "SUCCESS":
        emit("task_result", {"task_id": task_id, "result": result.result})
    elif result.state == "PENDING":
        emit("task_result", {"task_id": task_id, "status": "pending"})
    else:
        emit("task_result", {"task_id": task_id, "status": "error"}, status=500)


if __name__ == "__main__":
    socketio.run(app, debug=True)
