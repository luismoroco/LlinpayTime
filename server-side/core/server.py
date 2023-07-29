from flask import Flask


class WebServerEngine(Flask):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
