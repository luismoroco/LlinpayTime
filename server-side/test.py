"""import os

from dotenv import load_dotenv

from core import LLinpayCSVDataLoader, LLinpayDataManager, LLinpayVolumeManager

load_dotenv()

dirDataFinderByPath = LLinpayVolumeManager(
    "volume", str(os.getenv("FOLDER_REPOSITORY_FORMAT"))
)
print(dirDataFinderByPath.find())
print(dirDataFinderByPath.get_path_base_dir())

dirDataFinderByPath.check_format("air-quality")

csv_loader = LLinpayCSVDataLoader(dirDataFinderByPath.get_path_base_dir())

print(csv_loader.load("air-quality", "input", "data", "001.csv"))


data_manag = LLinpayDataManager(dirDataFinderByPath.get_path_base_dir())
data_manag.verify_file_coherence("air-quality")
print(data_manag.preprocess())

print(data_manag.verify_if_exist("air-quality"))

print(data_manag.handle_repository("air-quality"))
print(data_manag.handle_repository("air-quality"))
print(data_manag.handle_repository("air-quality"))


dirDataFinderByPath.init_volume()
print(dirDataFinderByPath.get_repositories())"""

from core.utils import apply_transform_to_df

print(
    apply_transform_to_df(
        "/media/lmoroco/D/5TO/TDS/LlinpayTime/server-side/volume/air-quality/output/station-inf/station-prep.csv"
    )
)
