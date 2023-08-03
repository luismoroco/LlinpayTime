import os

from dotenv import load_dotenv

from core import LLinpayDataManager, LLinpayPostgresConnector, LLinpayVolumeManager

load_dotenv()

__all__ = ["volume", "data", "conn"]

volume = LLinpayVolumeManager(
    os.getenv("BASE_VOLUME"), os.getenv("FOLDER_REPOSITORY_FORMAT")
)

volume.init_volume()

data = LLinpayDataManager(volume.get_path_base_dir())

db = LLinpayPostgresConnector(
    host=os.getenv("PG_HOST"),
    port=os.getenv("PG_PORT"),
    password=os.getenv("PG_PASS"),
    db_name=os.getenv("PG_NAME_DB"),
    user=os.getenv("PG_USER"),
)
conn = db.get_connect()
