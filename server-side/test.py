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
print(dirDataFinderByPath.get_repositories())

from core.utils import transform

print(
    transform(
        "/media/lmoroco/D/5TO/TDS/LlinpayTime/server-side/volume/air-quality/output/station-inf/station-prep.csv"
    )
)"""

"""from core.decorat import collect_ram_after, run_in_paralell
import time
from typing import List, Tuple
from statistics import mean
import random as rn
from threading import Thread

@run_in_paralell
def print_message(message):
    print(f"Start printing: {message}")
    time.sleep(5)
    print(f"Finished printing: {message}")

def generate_random() -> Tuple[float, float]:
    arr: List[float] = [rn.random() for _ in range(100000)]
    time.sleep(5)
    print("Finished")
    return (sum(arr), mean(arr))

def build_matrix() -> None:
    threads = []
    results = []

    for _ in range(15):
        thread = Thread(target=lambda: results.append(generate_random()))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    print(results)

start = time.time()
build_matrix()
end = time.time()


print(f"time: {end - start}")"""

"""start = time.time()

generate_random()
generate_random()
generate_random()
generate_random()

end = time.time()
"""
# print(f"time: {end, start}")


import random
import statistics
import time
from multiprocessing import Manager, Process
from typing import List, Tuple


def generate_random(result_queue: List[Tuple[float, float]]) -> None:
    arr: List[float] = [random.random() for _ in range(100000)]
    time.sleep(5)
    print("Finished")
    result_queue.append((sum(arr), statistics.mean(arr)))


def build_matrix() -> None:
    processes = []
    manager = Manager()
    results = manager.list()

    for _ in range(15):
        process = Process(target=generate_random, args=(results,))
        process.start()
        processes.append(process)

    for process in processes:
        process.join()

    print(results)


start = time.time()
build_matrix()
end = time.time()


print(f"time: {end - start}")
