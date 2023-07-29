import os

from dotenv import load_dotenv

from core import DirDataFinderByPath

load_dotenv()

dirDataFinderByPath = DirDataFinderByPath(
    "volume", str(os.getenv("FOLDER_REPOSITORY_FORMAT"))
)
print(dirDataFinderByPath.find())

dirDataFinderByPath.check_format("air-quality")
