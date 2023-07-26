__all__ = "ExceptionBase, GetExceptionInterface"


class LLinpayExceptionBase(Exception):
    error: int

    def __init__(self, message: str, error: str) -> None:
        super().__init__(message)
        self.error = error

    def get_exception(self) -> str:
        return f"Info: {self.args[0]} with code: {self.error}"
