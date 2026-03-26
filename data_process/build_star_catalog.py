import csv
import json
import re
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATA_PROCESS_DIR = ROOT / "data_process"
DATA_DIR = ROOT / "data"

BRIGHT_FILE = DATA_PROCESS_DIR / "hip_bright.csv"
CONSTELLATION_FILE = DATA_PROCESS_DIR / "name.fab"
CHINESE_NAME_FILE = DATA_PROCESS_DIR / "star_names.zh_CN.fab"
ENGLISH_NAME_FILE = DATA_PROCESS_DIR / "common_star_names.fab"
CONSTELLATION_LINES_FILE = DATA_PROCESS_DIR / "constellationship.fab"
OUTPUT_FILE = DATA_DIR / "star_catalog.json"

CONSTELLATION_INFO = {
    "And": ("Andromeda", "仙女座"),
    "Ant": ("Antlia", "唧筒座"),
    "Aps": ("Apus", "天燕座"),
    "Aql": ("Aquila", "天鹰座"),
    "Aqr": ("Aquarius", "宝瓶座"),
    "Ara": ("Ara", "天坛座"),
    "Ari": ("Aries", "白羊座"),
    "Aur": ("Auriga", "御夫座"),
    "Boo": ("Bootes", "牧夫座"),
    "CMa": ("Canis Major", "大犬座"),
    "CMi": ("Canis Minor", "小犬座"),
    "CVn": ("Canes Venatici", "猎犬座"),
    "Cae": ("Caelum", "雕具座"),
    "Cam": ("Camelopardalis", "鹿豹座"),
    "Cap": ("Capricornus", "摩羯座"),
    "Car": ("Carina", "船底座"),
    "Cas": ("Cassiopeia", "仙后座"),
    "Cen": ("Centaurus", "半人马座"),
    "Cep": ("Cepheus", "仙王座"),
    "Cet": ("Cetus", "鲸鱼座"),
    "Cha": ("Chamaeleon", "蝘蜓座"),
    "Cir": ("Circinus", "圆规座"),
    "Cnc": ("Cancer", "巨蟹座"),
    "Col": ("Columba", "天鸽座"),
    "Com": ("Coma Berenices", "后发座"),
    "CrA": ("Corona Australis", "南冕座"),
    "CrB": ("Corona Borealis", "北冕座"),
    "Crt": ("Crater", "巨爵座"),
    "Cru": ("Crux", "南十字座"),
    "Crv": ("Corvus", "乌鸦座"),
    "Cyg": ("Cygnus", "天鹅座"),
    "Del": ("Delphinus", "海豚座"),
    "Dor": ("Dorado", "剑鱼座"),
    "Dra": ("Draco", "天龙座"),
    "Equ": ("Equuleus", "小马座"),
    "Eri": ("Eridanus", "波江座"),
    "For": ("Fornax", "天炉座"),
    "Gem": ("Gemini", "双子座"),
    "Gru": ("Grus", "天鹤座"),
    "Her": ("Hercules", "武仙座"),
    "Hor": ("Horologium", "时钟座"),
    "Hya": ("Hydra", "长蛇座"),
    "Hyi": ("Hydrus", "水蛇座"),
    "Ind": ("Indus", "印第安座"),
    "LMi": ("Leo Minor", "小狮座"),
    "Lac": ("Lacerta", "蝎虎座"),
    "Leo": ("Leo", "狮子座"),
    "Lep": ("Lepus", "天兔座"),
    "Lib": ("Libra", "天秤座"),
    "Lup": ("Lupus", "豺狼座"),
    "Lyn": ("Lynx", "天猫座"),
    "Lyr": ("Lyra", "天琴座"),
    "Men": ("Mensa", "山案座"),
    "Mic": ("Microscopium", "显微镜座"),
    "Mon": ("Monoceros", "麒麟座"),
    "Mus": ("Musca", "苍蝇座"),
    "Nor": ("Norma", "矩尺座"),
    "Oct": ("Octans", "南极座"),
    "Oph": ("Ophiuchus", "蛇夫座"),
    "Ori": ("Orion", "猎户座"),
    "Pav": ("Pavo", "孔雀座"),
    "Peg": ("Pegasus", "飞马座"),
    "Per": ("Perseus", "英仙座"),
    "Phe": ("Phoenix", "凤凰座"),
    "Pic": ("Pictor", "绘架座"),
    "PsA": ("Piscis Austrinus", "南鱼座"),
    "Psc": ("Pisces", "双鱼座"),
    "Pup": ("Puppis", "船尾座"),
    "Pyx": ("Pyxis", "罗盘座"),
    "Ret": ("Reticulum", "网罟座"),
    "Scl": ("Sculptor", "玉夫座"),
    "Sco": ("Scorpius", "天蝎座"),
    "Sct": ("Scutum", "盾牌座"),
    "Ser": ("Serpens", "巨蛇座"),
    "Sex": ("Sextans", "六分仪座"),
    "Sge": ("Sagitta", "天箭座"),
    "Sgr": ("Sagittarius", "人马座"),
    "Tau": ("Taurus", "金牛座"),
    "Tel": ("Telescopium", "望远镜座"),
    "TrA": ("Triangulum Australe", "南三角座"),
    "Tri": ("Triangulum", "三角座"),
    "Tuc": ("Tucana", "杜鹃座"),
    "UMa": ("Ursa Major", "大熊座"),
    "UMi": ("Ursa Minor", "小熊座"),
    "Vel": ("Vela", "船帆座"),
    "Vir": ("Virgo", "室女座"),
    "Vol": ("Volans", "飞鱼座"),
    "Vul": ("Vulpecula", "狐狸座"),
}


FAB_NAME_RE = re.compile(r'^\s*(\d+)\|_\("(.+)"\)\s+\d+\s*$')
FAB_DESIGNATION_RE = re.compile(r"^\s*(\d+)\|([^\s]+)\s*$")
PREFERRED_CHINESE_NAMES = {
    "54061": "天枢",
    "53910": "天璇",
    "58001": "天玑",
    "59774": "天权",
    "62956": "玉衡",
    "65378": "开阳",
    "67301": "摇光",
}


def sanitize_id(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")
    return cleaned or "star"


def bv_to_color(bv: float | None) -> str:
    if bv is None:
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


def parse_english_names() -> dict[str, str]:
    names: dict[str, str] = {}
    for line in ENGLISH_NAME_FILE.read_text(encoding="utf-8").splitlines():
        match = FAB_NAME_RE.match(line)
        if match and match.group(1) not in names:
            names[match.group(1)] = match.group(2)
    return names


def parse_chinese_names() -> dict[str, list[str]]:
    names: dict[str, list[str]] = defaultdict(list)
    for raw_line in CHINESE_NAME_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        match = FAB_NAME_RE.match(line)
        if match:
            names[match.group(1)].append(match.group(2))
    return names


def parse_constellations() -> tuple[dict[str, str], dict[str, str]]:
    constellation_by_hip: dict[str, str] = {}
    designation_by_hip: dict[str, str] = {}
    for line in CONSTELLATION_FILE.read_text(encoding="utf-8").splitlines():
        match = FAB_DESIGNATION_RE.match(line)
        if not match:
            continue
        hip, designation = match.groups()
        if "_" not in designation:
            continue
        prefix, constellation = designation.rsplit("_", 1)
        constellation_by_hip.setdefault(hip, constellation)
        designation_by_hip.setdefault(hip, designation)
    return constellation_by_hip, designation_by_hip


def parse_constellation_lines() -> dict[str, list[list[str]]]:
    lines_by_constellation: dict[str, list[list[str]]] = {}
    for raw_line in CONSTELLATION_LINES_FILE.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        parts = line.split()
        if len(parts) < 2:
            continue

        abbreviation = parts[0]
        try:
            segment_count = int(parts[1])
        except ValueError:
            continue

        hips = parts[2 : 2 + segment_count * 2]
        if len(hips) < segment_count * 2:
            continue

        segments: list[list[str]] = []
        for index in range(0, len(hips), 2):
            segments.append([hips[index], hips[index + 1]])
        lines_by_constellation[abbreviation] = segments
    return lines_by_constellation


def choose_chinese_name(hip: str, names: list[str]) -> str:
    if not names:
        return ""
    preferred_name = PREFERRED_CHINESE_NAMES.get(hip)
    if preferred_name and preferred_name in names:
        return preferred_name
    for name in names:
        if "?" not in name:
            return name
    return names[0]


def compute_ra_bounds(ras: list[float]) -> tuple[float, float]:
    values = sorted(ras)
    if len(values) == 1:
        center = values[0]
        pad = 4.0
        return (center - pad) % 360, (center + pad) % 360

    extended = values + [values[0] + 360]
    max_gap = -1.0
    max_index = 0
    for index in range(len(values)):
        gap = extended[index + 1] - extended[index]
        if gap > max_gap:
            max_gap = gap
            max_index = index

    start = extended[max_index + 1] % 360
    end = extended[max_index] % 360
    span = 360 - max_gap
    pad = max(4.0, span * 0.08)
    return (start - pad) % 360, (end + pad) % 360


def compute_dec_bounds(decs: list[float]) -> tuple[float, float]:
    dec_min = min(decs)
    dec_max = max(decs)
    span = dec_max - dec_min
    pad = max(3.0, span * 0.12)
    return max(-90.0, dec_min - pad), min(90.0, dec_max + pad)


def build_catalog() -> dict[str, dict]:
    english_names = parse_english_names()
    chinese_names = parse_chinese_names()
    constellation_by_hip, designation_by_hip = parse_constellations()
    constellation_lines = parse_constellation_lines()

    grouped: dict[str, list[dict]] = defaultdict(list)
    with BRIGHT_FILE.open("r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            hip = row["HIP"].strip()
            constellation = constellation_by_hip.get(hip)
            if not constellation:
                continue
            if not row["RAdeg"] or not row["DEdeg"] or not row["Vmag"]:
                continue
            english_name = english_names.get(hip, designation_by_hip.get(hip, constellation))
            chinese_name = choose_chinese_name(hip, chinese_names.get(hip, []))
            bv = float(row["B-V"]) if row["B-V"] else None
            star = {
                "id": f"hip_{hip}_{sanitize_id(english_name)}",
                "catalog_id": f"HIP {hip}",
                "name_cn": chinese_name,
                "name_en": english_name,
                "mag": round(float(row["Vmag"]), 2),
                "ra": round(float(row["RAdeg"]), 5),
                "dec": round(float(row["DEdeg"]), 5),
                "color": bv_to_color(bv),
                "constellation": CONSTELLATION_INFO.get(constellation, (constellation, constellation))[0],
            }
            grouped[constellation].append(star)

    catalog: dict[str, dict] = {}
    for abbreviation, stars in sorted(grouped.items()):
        display_name_en, display_name_cn = CONSTELLATION_INFO.get(abbreviation, (abbreviation, abbreviation))
        ras = [star["ra"] for star in stars]
        decs = [star["dec"] for star in stars]
        ra_min, ra_max = compute_ra_bounds(ras)
        dec_min, dec_max = compute_dec_bounds(decs)
        catalog[display_name_en.lower().replace(" ", "_")] = {
            "display_name_cn": display_name_cn,
            "display_name_en": display_name_en,
            "abbreviation": abbreviation,
            "bounds": {
                "ra_min": round(ra_min, 3),
                "ra_max": round(ra_max, 3),
                "dec_min": round(dec_min, 3),
                "dec_max": round(dec_max, 3),
            },
            "lines": constellation_lines.get(abbreviation, []),
            "stars": sorted(stars, key=lambda star: star["mag"]),
        }
    return catalog


def main() -> None:
    catalog = build_catalog()
    OUTPUT_FILE.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(catalog)} constellations to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
