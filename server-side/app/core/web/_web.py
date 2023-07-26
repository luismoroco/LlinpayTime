from typing import Union, Optional, List
import logging as loog

from flask import Flask

from ..abc._abc import SetupAndShutdownAppInterface
from ..exception._except import LlinpayWebCoreException


class EngineWebBase:
    engine_id: Union[str, int]

    def __init__(self, engine_id: Union[str, int]) -> None:
        self.engine_id = engine_id


class FlaskEngineWebCore(EngineWebBase, Flask, SetupAndShutdownAppInterface):
    with_support: Optional[List[str]]
    port: Union[int, str]
    debug: bool

    def __init__(
        self,
        engine_id: Union[str, int],
        port: Union[int, str],
        support: Optional[List[str]],
        debug: bool = False,
    ) -> None:
        EngineWebBase.__init__(self, engine_id)
        Flask.__init__(self)
        self.with_support = support
        self.port = port
        self.debug = debug

    def init_app(self) -> None:
        try:
            self.run(port=self.port, debug=self.debug)

            loog.info(f"Core running in port: {self.port}")
        except LlinpayWebCoreException as e:
            raise LlinpayWebCoreException("Error in WebCore Init", 544, "Flask") from e
