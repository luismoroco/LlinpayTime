from typing import Any, List, Optional, Union

from psycopg2 import connect

from .abc import ILLinpayConector, ILLinpayQueryAsyncTableEngine
from .exc import LLinpayTableNotFound


class LLinpayDataConectorBase:
    port: Union[str, int]
    host: Union[str, int]
    __user: str
    __password: str
    db_name: str


class LLinpayPostgresConnector(LLinpayDataConectorBase, ILLinpayConector):
    __slots__ = ("connection",)

    connection: Union[Any, None]

    def __init__(
        self,
        port: Union[str, int],
        host: Union[str, int],
        user: str,
        password: str,
        db_name: str,
    ) -> None:
        self.port = port
        self.host = host
        self.__user = user
        self.__password = password
        self.db_name = db_name
        self.connection = None

    def get_connect(self) -> Union[Any, None]:
        if self.connection is None:
            self.connection = connect(
                host=self.host,
                port=self.port,
                dbname=self.db_name,
                user=self.__user,
                password=self.__password,
            )
            return self.connection

        return self.connection


class QueryEngineBase:
    __slots__ = ("table", "query", "db", "cursor")

    db: str
    table: str
    query: str
    cursor: Any

    def __init__(self, table: str, db: str, cursor: Any) -> None:
        self.table = table
        self.table = db
        self.table = cursor
        self.query = (
            f"SELECT EXISTS (SELECT 1 FROM {db}.tables WHERE table_name = '{table}')"
        )
        self.verify()

    def verify(self) -> None:
        self.cursor.execute(self.query)
        res = self.cursor.fetchone()[0]
        self.cursor.close()

        if not res:
            raise LLinpayTableNotFound(self.table)
