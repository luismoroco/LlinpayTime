from .app.core.web import FlaskEngineWebCore

app = FlaskEngineWebCore("001", 5000)

app.init_app()