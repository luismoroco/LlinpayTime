import os

from dotenv import load_dotenv
from flask import jsonify

from core import WebServerEngine, jsonAdapter
from manage import volume

load_dotenv()

app = WebServerEngine(__name__)


@app.route("/")
def index():
    return "<h1>Hello World</h1>"


@app.route("/volumes")
def get_volumes_dir():
    return jsonify(jsonAdapter.export(("name", volume.get_repositories())))
