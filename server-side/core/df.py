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
    processed_repositories: List[Tuple[str, bool]]
    repository_id: str

    def __init__(self, base_path: str) -> None:
        self.loader = LLinpayCSVDataLoader(base_path)
        self.checker = LLinpayFileHandler()
        self.base_path = base_path

    @collect_ram_after
    def verify_file_coherence(self, repository_id: str) -> Optional[bool]:
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

        self.temp_paths = files[1:]
        self.temp_headers = pivot_header[1:]
        self.repository_id = repository_id

        return True

    @collect_ram_after
    def preprocess(self) -> Optional[bool]:
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

        self.temp_stations_df.to_csv(
            os.path.join(
                self.base_path,
                self.repository_id,
                "output",
                "station-inf",
                "station-prep.csv",
            ),
            index=False,
        )

        loog.info(f"Data preprocessed. Repository {self.repository_id} info exported")
        return True
