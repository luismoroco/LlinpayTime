import time

from celery import Celery
from flask import Flask, jsonify

app = Flask(__name__)

celery = Celery(
    __name__, broker="redis://127.0.0.1:6379/0", backend="redis://127.0.0.1:6379/0"
)

celery.conf.update(app.config)


@celery.task()
def add(x, y):
    time.sleep(10)
    return x + y


@app.route("/")
def add_task():
    for i in range(20):
        add.delay(i, i + 1)

    return jsonify({"status": "ok"})
