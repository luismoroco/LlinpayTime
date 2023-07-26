from abc import abstractmethod, ABC


class GetExceptionInterface(ABC):
    @abstractmethod
    def build_exception(self) -> str:
        raise NotImplemented


class SetupAndShutdownAppInterface(ABC):
    @abstractmethod
    def init_app(self) -> None:
        raise NotImplemented

    @abstractmethod
    def stop_app(self) -> None:
        raise NotImplemented
