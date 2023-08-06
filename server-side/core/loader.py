import os
from typing import List, Optional, Union

from pandas import DataFrame, read_csv

from core.abc import ILLinpayFileLoader
from core.exc import LLinpayRepositoryFileNotFound


class LLinpayDataLoaderBase:
    __slots__ = ("abs_path_dir",)

    abs_path_dir: Union[str, List[str]]

    def __init__(self, path_dir: Union[str, List[str]]) -> None:
        self.abs_path_dir = path_dir


class LLinpayCSVDataLoader(LLinpayDataLoaderBase, ILLinpayFileLoader):
    def __init__(self, path_dir: Union[str, List[str]]) -> None:
        super().__init__(path_dir)

    def load(
        self, repository_id: str, io_dir: str, set_dir: str, file_name: str
    ) -> Optional[DataFrame]:
        file_path = os.path.join(
            self.abs_path_dir, repository_id, io_dir, set_dir, file_name
        )

        if os.path.exists(file_path) is False:
            raise LLinpayRepositoryFileNotFound(repository_id, file_name)

        return read_csv(file_path)

    @staticmethod
    def direct_load(path_abs: str, **kargs) -> DataFrame:
        return read_csv(path_abs, **kargs)

    @staticmethod
    def header(path_abs: str, **kargs) -> List[str]:
        return read_csv(path_abs, **kargs).columns.to_list()
