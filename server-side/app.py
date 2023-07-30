from celery import Celery
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config["SECRET_KEY"] = "chobolin"
app_socket = SocketIO(app)

celery = Celery(
    __name__,
    broker="redis://127.0.0.1:6379/0",
    backend="redis://127.0.0.1:6379/0"
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