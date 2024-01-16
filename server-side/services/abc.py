import abc
from typing import Dict, Optional

from pandas import DataFrame

__all__ = ["AbstractImputation"]


class AbstractImputation(abc.ABC):
    @abc.abstractmethod
    def impute(input: DataFrame, spec: Optional[Dict] = None) -> DataFrame:
        raise NotImplementedError
