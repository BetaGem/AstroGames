import json
from pathlib import Path
from typing import Any


DATA_FILE = Path(__file__).with_name("data").joinpath("star_catalog.json")


def load_catalog() -> dict[str, Any]:
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


CONSTELLATION_REGIONS = load_catalog()


def get_constellation_region(key: str) -> dict[str, Any]:
    return CONSTELLATION_REGIONS[key]
