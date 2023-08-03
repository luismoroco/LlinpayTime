from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar, Union

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


class ILLinpayConector(ABC):
    @abstractmethod
    def get_connect(self) -> T:
        raise NotImplemented


class ILLinpayQueryAsyncTableEngine(ABC):
    @abstractmethod
    def start(self, params: T) -> None:
        raise NotImplemented

    @abstractmethod
    def end(self, params: V) -> None:
        raise NotImplemented
