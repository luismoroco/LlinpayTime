import glob
import os
from typing import List, Optional, Tuple

from pandas import DataFrame

from core.abc import ILLinpayFileFormatValidator
from core.decorat import collect_ram_after
from core.exc import LLinpayRepositoryBadFormat, LLinpayRepositoryFileBadFormat
from core.loader import LLinpayCSVDataLoader
from core.log import loog


class LLinpayDataFrameBase(DataFrame):
    __slots__ = ("name_file",)

    name_file: str

    def __init__(self, *args, name: str, **kwargs):
        super().__init__(*args, **kwargs)
        self.name_file = name


class LLinpayFileHandler(ILLinpayFileFormatValidator):
    @collect_ram_after
    def check(
        self, file: str, columns: str, required_headers: List[str]
    ) -> Optional[bool]:
        if not set(columns).issubset(required_headers):
            raise LLinpayRepositoryFileBadFormat(file, required_headers)
        return True

    def get_info(self, df: DataFrame, type: str) -> int:
        if type == "station":
            return df["id"].nunique()
        if type == "data":
            return len(df.columns.to_list()) - 1


class LLinpayDataExporter:
    __slots__ = "base_path"

    base_path: str

    def __init__(self, base_path: str) -> None:
        self.base_path = base_path

    def export(self, df: DataFrame, target_path: str) -> Optional[bool]:
        if df and target_path:
            dirs = target_path.split("/")
            df.to_csv(os.path.join(self.base_path, dirs), index=False)
            return True
        return False


class LLinpayDataManager:
    __slots__ = (
        "loader",
        "checker",
        "base_path",
        "temp_paths",
        "processed_repositories",
        "temp_headers",
        "temp_stations_df",
        "repository_id",
    )

    loader: LLinpayCSVDataLoader
    checker: LLinpayFileHandler
    base_path: str
    temp_paths: List[str]
    temp_headers: List[str]
    temp_stations_df: DataFrame
    processed_repositories: List[Tuple[str, bool, str, List[str]]]
    repository_id: str

    def __init__(self, base_path: str) -> None:
        self.loader = LLinpayCSVDataLoader(base_path)
        self.checker = LLinpayFileHandler()
        self.base_path = base_path
        self.processed_repositories = []

    @collect_ram_after
    def handle_repository(self, repository_id: str) -> Optional[Tuple[str, List[str]]]:
        is_found: Tuple[bool, int] = self.verify_if_exist(repository_id)
        if is_found[0]:
            loog.warning(f"{repository_id} preprocessed before")
            (_, _, repo_path, vars) = self.processed_repositories[is_found[1]]
            return repo_path, vars

        loog.info(f"Processing files of {repository_id}")
        self.verify_file_coherence(repository_id)
        return self.preprocess()

    @collect_ram_after
    def verify_file_coherence(self, repository_id: str) -> None:
        repository_path = os.path.join(
            self.base_path, repository_id, "input", "**/*.csv"
        )
        files: List[str] = glob.glob(repository_path, recursive=True)

        if len(files) < 2:
            raise LLinpayRepositoryBadFormat(repository_id)

        self.temp_stations_df = self.loader.direct_load(
            files[0], sep=",", dtype={"id": str}
        )
        data_files_needed = [
            f"{item}.csv" for item in self.temp_stations_df["id"].unique()
        ]
        data_found = [item.split("/")[-1] for item in files[1:]]

        if set(data_files_needed) != set(data_found):
            raise LLinpayRepositoryBadFormat(repository_id)

        pivot_header = self.loader.header(files[1])
        for file in files[2:]:
            if pivot_header != self.loader.header(file):
                raise LLinpayRepositoryFileBadFormat(file, pivot_header)

        self.temp_paths = sorted(files[1:], key=lambda path: path.split("/")[-1])
        self.temp_headers = pivot_header[1:]
        self.repository_id = repository_id

    @collect_ram_after
    def preprocess(self) -> str:
        matriz: List[List[float]] = []
        for file in self.temp_paths:
            _row: List[float] = []
            df: DataFrame = self.loader.direct_load(file)

            for var in self.temp_headers:
                nan_percent: float = df[var].isnull().mean() * 100
                _row.append(nan_percent)

            matriz.append(_row)

        for i, var in enumerate(self.temp_headers):
            self.temp_stations_df[var] = [row[i] for row in matriz]

        _path = os.path.join(
            self.base_path,
            self.repository_id,
            "output",
            "station-inf",
            "station-prep.csv",
        )

        self.temp_stations_df.to_csv(
            _path,
            index=False,
        )

        loog.info(
            f"Data preprocessed. Repository {self.repository_id} info exported. Cleaning"
        )

        res: Tuple[str, List[str]] = (_path, self.temp_headers)
        self.set_repository_processed_status(_path, self.temp_headers)
        self.clear_manager()
        return res

    def verify_if_exist(self, repository_id: str) -> Tuple[bool, int]:
        for index, (string, state, _, _) in enumerate(self.processed_repositories):
            if string == repository_id and state:
                return (True, index)
        return (False, -1)

    def set_repository_processed_status(self, _path: str, headers: List[str]) -> None:
        self.processed_repositories.append((self.repository_id, True, _path, headers))

    def clear_manager(self) -> None:
        self.temp_paths = None
        self.temp_headers = None
        self.temp_stations_df = None
        self.repository_id = None
