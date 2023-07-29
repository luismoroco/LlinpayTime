from abc import ABC, abstractmethod
from typing import TypeVar

T = TypeVar("T")
V = TypeVar("V")


class LLinpayAdapterInterface(ABC):
    @abstractmethod
    def export(self, args: V) -> T:
        raise NotImplemented
