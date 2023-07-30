import os

from dotenv import load_dotenv

from core import *

load_dotenv()

__all__ = ["volume", "data"]

volume = LLinpayVolumeManager(
    str(os.getenv("BASE_VOLUME")), str(os.getenv("FOLDER_REPOSITORY_FORMAT"))
)

volume.init_volume()

data = LLinpayDataManager(volume.get_path_base_dir())
