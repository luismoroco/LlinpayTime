import os

from dotenv import load_dotenv

from core import DirDataFinderByPath, LLinpayCSVDataLoader, LLinpayDataManager

load_dotenv()

dirDataFinderByPath = DirDataFinderByPath(
    "volume", str(os.getenv("FOLDER_REPOSITORY_FORMAT"))
)
print(dirDataFinderByPath.find())
print(dirDataFinderByPath.get_path_base_dir())

dirDataFinderByPath.check_format("air-quality")

csv_loader = LLinpayCSVDataLoader(dirDataFinderByPath.get_path_base_dir())

print(csv_loader.load("air-quality", "input", "data", "001.csv"))


data_manag = LLinpayDataManager(dirDataFinderByPath.get_path_base_dir())
"""data_manag.verify_file_coherence("air-quality")
print(data_manag.preprocess())

print(data_manag.verify_if_exist("air-quality"))"""

print(data_manag.handle_repository("air-quality"))
print(data_manag.handle_repository("air-quality"))
print(data_manag.handle_repository("air-quality"))
