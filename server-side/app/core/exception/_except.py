from typing import Optional
from ..abc._abc import GetExceptionInterface


class BaseException(Exception):
    error: Optional[str]

    def __init__(self, message: str, error: Optional[str]) -> None:
        super().__init__(message)
        self.error = error


class LlinpayWebCoreException(BaseException, GetExceptionInterface):
    engine: Optional[str]

    def __init__(
        self, message: str, error: Optional[str], engine: Optional[str]
    ) -> None:
        super().__init__(message, error)
        self.engine = engine

    def build_exception(self) -> str:
        return f"INF: {self.args[0]}, CODE: {self.error} && ENGINE: {self.engine}"
