import logging as logg

from flask import Flask
from typing import Optional, List, Union

from .err import LLinpayExceptionBase


class CoreApplicationException(LLinpayExceptionBase):
    engine: str

    def __init__(self, message: str, error: str, engine: str) -> None:
        super().__init__(message, error)
        self.engine = engine


class LlinpayBaseServer(Flask):
    authors: Optional[List[str]]
    port: Union[int, str]
    debug: Optional[bool]

    def __init__(
        self,
        port: Union[int, str],
        authors: Optional[List[str]],
        debug: bool = False,
        *args,
        **kwargs,
    ) -> None:
        super().__init__(*args, **kwargs)
        self.authors = authors
        self.port = port
        self.debug = debug

    def run_app(self) -> None:
        try:
            self.run(port=self.port, debug=self.debug)
            logg.info(f"Core running in port: {self.port}")

        except LLinpayExceptionBase as e:
            logg.error(e.get_exception())
