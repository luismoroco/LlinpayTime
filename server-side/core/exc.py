from typing import List, Optional, Union

__all__ = ["LLinpayDataDirBaseNotFound"]


class LLinpayBaseExeption(Exception):
    def __init__(self, message: str) -> None:
        super().__init__(message)


class LLinpayDirDataNotFound(LLinpayBaseExeption):
    def __init__(self, data_base_dir: str) -> None:
        super().__init__(
            f"The DIR doesn't exist in the base {data_base_dir} dir, please create another dir"
        )


class LLinpayRepositoryNotFound(LLinpayBaseExeption):
    def __init__(self) -> None:
        super().__init__(f"The volume exist, but the repository provided doesnot exist")


class LLinpayBaseDirDataNotProvided(LLinpayBaseExeption):
    def __init__(self) -> None:
        super().__init__(
            f"The base DIR Volume not provided. It must exist for generate the data"
        )


class LLinpayVolumeDirCantBeEmptyError(LLinpayBaseExeption):
    def __init__(self) -> None:
        super().__init__(
            f"Base volume exist, but cant be empty. Must include a repository of data minimun"
        )


class LLinpayDataDirBaseNotFound(LLinpayBaseExeption):
    def __init__(self) -> None:
        super().__init__(
            f"The base DIR Volume doesn't exist in the root project, please verify it"
        )


class LLinpayRepositoryBadFormat(LLinpayBaseExeption):
    def __init__(self, repository_id: str) -> None:
        super().__init__(
            f"Check the {repository_id} repository integrity. Check readme requirements"
        )


class LLinpayRepositoryFileNotFound(LLinpayBaseExeption):
    def __init__(self, repository_id: str, file_name: str) -> None:
        super().__init__(
            f"Check the {repository_id} repository integrity. The {file_name} doesnt exist"
        )


class LLinpayRepositoryFileBadFormat(LLinpayBaseExeption):
    def __init__(self, file_name: str, headers: List[str]) -> None:
        super().__init__(
            f"The {file_name} is found, but hasnt the required header: {headers}"
        )
