import glob
import os
from typing import Dict, List, Optional, Tuple, Union

from pandas import DataFrame, read_csv
from sklearn.linear_model import LinearRegression
from statsmodels.tsa.stattools import adfuller

from core.decorat import collect_ram_after
from core.log import loog

memory: List[Tuple[str, str, Dict]] = []

METHOD_FILL = "interpolate"


@collect_ram_after
def get_df_from_abs_path(path: str) -> DataFrame:
    return read_csv(path, dtype={"id": str})


@collect_ram_after
def transform(path) -> List[Dict]:
    df = get_df_from_abs_path(path)

    inf: List[Dict] = []
    for _, row in df.iterrows():
        vars = []
        counter: int = 0

        for var in df.columns[4:]:
            vars.append({"name": var, "percent_nan": row[var]})

            if row[var] != 100.0:
                counter += 1

        station: Dict = {
            "id": row["id"],
            "name": row["name"],
            "lon": row["lon"],
            "lat": row["lat"],
            "len_vars": counter,
            "vars": vars,
        }

        inf.append(station)

    return inf


@collect_ram_after
def apply_linear_regresion(X, y) -> float:
    lr = LinearRegression()
    lr.fit(X, y)
    return lr.coef_[0]


@collect_ram_after
def apply_fuller_test(X) -> float:
    res = adfuller(X)
    return res[1]


@collect_ram_after
def find_in_memo(_repo: str, _name: str) -> int:
    for index, (repo, id, _) in enumerate(memory):
        if _repo == repo and id == _name:
            return index
    return -1


@collect_ram_after
def handle_repo_stat_val(path_base: str, req: List[str]) -> Dict:
    file_name = f"{req[1]}_{req[2]}.csv"
    found = find_in_memo(req[0], file_name)

    if found == -1:
        loog.info(f"Processing: {file_name} file")
        _path = os.path.join(path_base, req[0], "input", "data", f"{req[1]}.csv")
        _out_path = os.path.join(path_base, req[0], "load", file_name)

        df = read_csv(_path, usecols=["date", req[2]], parse_dates=["date"])

        _df = df.copy()
        _df[req[2]].interpolate(inplace=True)

        X = _df.index.values.reshape(-1, 1)
        y = _df[req[2]]

        _df = _df.resample("D", on="date").mean()
        _df.dropna(subset=[req[2]], inplace=True)
        df.rename(columns={req[2]: 'data'}, inplace=True)
        res = {
            "repository": req[0],
            "path": _out_path,
            "method": METHOD_FILL,
            "trend": "{:.5f}".format(apply_linear_regresion(X, y)),
            "p-value": "{:.5f}".format(apply_fuller_test(_df[req[2]])),
        }

        df.to_csv(_out_path, index=False)

        memory.append((req[0], file_name, res))
        return res

    loog.warning(f"{file_name} preprocessed before")
    return memory[found][2]
