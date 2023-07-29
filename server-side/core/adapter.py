from typing import Dict, List, Tuple

from core.abc import ILLinpayAdapter


class LLinpayJSONAdapter(ILLinpayAdapter):
    def export(self, args: Tuple[str, List[str]]) -> List[Dict[str, str]]:
        return [{args[0]: item} for item in args[1]]
