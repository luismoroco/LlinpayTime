from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar

T = TypeVar("T")
V = TypeVar("V")
F = TypeVar("F")


class ILLinpayAdapter(ABC):
    @abstractmethod
    def export(self, args: V) -> T:
        raise NotImplemented


class ILLinpayFileFormatValidator(ABC):
    @abstractmethod
    def check(
        self, file: str, columns: str, required_headers: List[str]
    ) -> Optional[bool]:
        raise NotImplemented


class ILLinpayFileLoader(ABC):
    @abstractmethod
    def load(
        self, repository_id: str, io_dir: str, set_dir: str, file_name: str
    ) -> Optional[F]:
        raise NotImplemented
