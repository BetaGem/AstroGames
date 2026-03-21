import csv
import json
from functools import lru_cache
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).with_name("data")
DATA_FILE = DATA_DIR.joinpath("star_catalog.json")
HIPPARCOS_FILE = DATA_DIR.joinpath("hip_main.csv")


def load_catalog() -> dict[str, Any]:
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def _parse_hip_id(catalog_id: str) -> str:
    return catalog_id.replace("HIP", "").strip()


def bv_to_color(bv_raw: str) -> str:
    try:
        bv = float(bv_raw)
    except (TypeError, ValueError):
        return "#f4f7ff"

    bv = max(-0.4, min(2.0, bv))
    anchors = [
        (-0.4, (155, 176, 255)),
        (0.0, (202, 215, 255)),
        (0.4, (248, 247, 255)),
        (0.8, (255, 244, 234)),
        (1.2, (255, 210, 161)),
        (1.6, (255, 177, 109)),
        (2.0, (255, 140, 90)),
    ]

    for index in range(len(anchors) - 1):
        left_bv, left_rgb = anchors[index]
        right_bv, right_rgb = anchors[index + 1]
        if left_bv <= bv <= right_bv:
            ratio = (bv - left_bv) / (right_bv - left_bv)
            rgb = tuple(round(left_rgb[i] + ratio * (right_rgb[i] - left_rgb[i])) for i in range(3))
            return "#" + "".join(f"{value:02x}" for value in rgb)

    return "#f4f7ff"


@lru_cache(maxsize=1)
def load_hipparcos() -> list[dict[str, Any]]:
    stars: list[dict[str, Any]] = []
    with HIPPARCOS_FILE.open("r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                ra = float(row["RAdeg"])
                dec = float(row["DEdeg"])
                mag = float(row["Vmag"])
            except (KeyError, TypeError, ValueError):
                continue

            stars.append(
                {
                    "id": f"hip_{row['HIP']}",
                    "catalog_id": f"HIP {row['HIP']}",
                    "hip": row["HIP"],
                    "name_cn": "",
                    "name_en": "",
                    "mag": mag,
                    "ra": ra,
                    "dec": dec,
                    "color": bv_to_color(row.get("B-V", "")),
                    "constellation": "",
                }
            )
    return stars


CONSTELLATION_REGIONS = load_catalog()


def get_constellation_region(key: str) -> dict[str, Any]:
    return CONSTELLATION_REGIONS[key]


def get_region_stars(key: str, mag_limit: float = 6.5) -> list[dict[str, Any]]:
    region = get_constellation_region(key)
    bounds = region["bounds"]

    stars = [
        dict(star)
        for star in load_hipparcos()
        if bounds["ra_min"] <= star["ra"] <= bounds["ra_max"]
        and bounds["dec_min"] <= star["dec"] <= bounds["dec_max"]
        and star["mag"] <= mag_limit
    ]

    named_by_hip = {
        _parse_hip_id(star["catalog_id"]): star
        for star in region["stars"]
        if star.get("catalog_id", "").startswith("HIP ")
    }

    for star in stars:
        named = named_by_hip.get(star["hip"])
        if named:
            star["id"] = named["id"]
            star["name_cn"] = named.get("name_cn", "")
            star["name_en"] = named.get("name_en", "")
            star["constellation"] = named.get("constellation", "")

    return stars
