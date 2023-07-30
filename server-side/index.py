import os

from dotenv import load_dotenv

load_dotenv()

from _app import app

if __name__ == "__main__":
    app.run(
        host=os.getenv("HOST"),
        port=os.getenv("PORT"),
        debug=os.getenv("DEBUG"),
    )
