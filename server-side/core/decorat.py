import gc
from functools import wraps
from multiprocessing import Process
from typing import Any, Callable, TypeVar

T = TypeVar("T")


def collect_ram_after(func: Callable[..., T]) -> Callable[..., T]:
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        res: T = func(*args, **kwargs)
        gc.collect()
        return res

    return wrapper


def run_in_paralell(func: Callable[..., T]) -> Callable[..., T]:
    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        process = Process(target=func, args=args, kwargs=kwargs)
        process.start()

        return process

    return wrapper
