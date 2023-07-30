from typing import Dict, List

from pandas import DataFrame, read_csv

from core.decorat import collect_ram_after


@collect_ram_after
def get_df_from_abs_path(path: str) -> DataFrame:
    return read_csv(path)


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
