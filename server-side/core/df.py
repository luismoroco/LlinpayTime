import glob
import os
from typing import List, Optional, Tuple, Union

from pandas import DataFrame

from core.abc import ILLinpayFileFormatValidator
from core.decorat import collect_ram_after
from core.exc import LLinpayRepositoryBadFormat, LLinpayRepositoryFileBadFormat
from core.loader import LLinpayCSVDataLoader


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


class LLinpayDataManager:
    __slots__ = (
        "loader",
        "checker",
        "base_path",
        "temp_paths",
        "processed_repositories",
    )

    loader: LLinpayCSVDataLoader
    checker: LLinpayFileHandler
    base_path: str
    temp_paths: List[str]
    processed_repositories: List[Tuple[str, bool]]

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

        df_stations = self.loader.direct_load(files[0], sep=",", dtype={"id": str})
        data_files_needed = [f"{item}.csv" for item in df_stations["id"].unique()]
        data_found = [item.split("/")[-1] for item in files[1:]]

        if set(data_files_needed) != set(data_found):
            raise LLinpayRepositoryBadFormat(repository_id)

        pivot_header = self.loader.header(files[1])
        for file in files[2:]:
            if pivot_header != self.loader.header(file):
                raise LLinpayRepositoryFileBadFormat(file, pivot_header)

        self.temp_paths = files

    @collect_ram_after
    def preprocess(self) -> Optional[bool]:
        pass
