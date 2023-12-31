import os
from typing import List, Optional, Union

from core.exc import (
    LLinpayBaseDirDataNotProvided,
    LLinpayDataDirBaseNotFound,
    LLinpayRepositoryBadFormat,
    LLinpayRepositoryNotFound,
    LLinpayVolumeDirCantBeEmptyError,
)
from core.log import loog


class DTORepository:
    name: str
    len_stations: int
    len_variables: int
    status: bool


class LLinpayVolumeManager:
    __slots__ = (
        "base_dir_data",
        "repositories_available",
        "required_folders_repository",
    )

    base_dir_data: Union[str, int]
    repositories_available: List[str]
    required_folders_repository: List[str]

    def __init__(self, base_dir_data: Union[str, int], repo_format: str) -> None:
        if not base_dir_data:
            raise LLinpayBaseDirDataNotProvided
        else:
            partial_path: str = os.path.abspath(".")
            self.base_dir_data = os.path.join(partial_path, base_dir_data)

            if os.path.exists(self.base_dir_data) is False:
                raise LLinpayDataDirBaseNotFound

            self.required_folders_repository = repo_format.split("_")

    def init_volume(self) -> None:
        self.find()
        self.repositories_available = [
            repo for repo in self.repositories_available if self.check_format(repo)
        ]

        loog.info("Volume mounted successfully")

    def find(self) -> None:
        volume_dirs: List[str] = os.listdir(self.base_dir_data)

        if len(volume_dirs) == 0:
            raise LLinpayVolumeDirCantBeEmptyError

        self.repositories_available = volume_dirs

    def check_format(self, repository_id: str) -> Optional[bool]:
        if repository_id not in self.repositories_available:
            raise LLinpayRepositoryNotFound

        required_folders: List[str] = []
        repository_path_base = os.path.join(self.base_dir_data, repository_id)
        for _, folder, _ in os.walk(repository_path_base):
            required_folders.extend(folder)

        if set(required_folders) != set(self.required_folders_repository):
            raise LLinpayRepositoryBadFormat(repository_id)
        return True

    def get_path_base_dir(self) -> str:
        return self.base_dir_data

    def get_repositories(self) -> List[str]:
        return self.repositories_available
