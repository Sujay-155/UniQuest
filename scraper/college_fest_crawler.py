"""
Crawls two Wikipedia list pages covering Indian college festivals and writes
the merged, deduplicated result to server/data/college_fests.json.

Nothing about institutions or column layout is hardcoded:
  - SOURCE_A ("List of festivals in Indian colleges") is one row per
    festival; columns are located dynamically from that table's own header
    row.
  - SOURCE_B ("...festivals in IITs and NITs") is one row per institute,
    with a separate column per festival type (Cultural/Technical/Sports for
    IITs, Cultural/Technical only for NITs). The set of type-columns present
    is read from each table's own header row rather than assumed, and each
    cell is parsed as "Name (year)" to split festival name from founding
    year.

There is no reliable public source for *this year's* exact fest dates -
those live on each fest's own site/social pages and change annually - so
only the historical "first held" year is captured. Nothing here invents an
upcoming date.
"""

import json
import logging
import os
import re

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SOURCE_A_URL = "https://en.wikipedia.org/wiki/List_of_festivals_in_Indian_colleges"
SOURCE_B_URL = "https://en.wikipedia.org/wiki/List_of_cultural,_technical_and_sports_festivals_in_IITs_and_NITs"
OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "server", "data", "college_fests.json"
)

HEADERS = {"User-Agent": "UniQuestCrawler/1.0 (educational project; contact via GitHub)"}

SOURCE_A_ALIASES = {
    "state": ["state", "ut"],
    "location": ["location", "city"],
    "institution": ["college", "institution", "institute"],
    "name": ["festival", "name"],
    "festival_type": ["type"],
    "first_held": ["first held", "year", "established"],
}

FEST_TYPE_COLUMN_KEYWORDS = ["cultural", "technical", "sports", "techno"]


def clean_text(text: str) -> str:
    text = re.sub(r"\[\s*\d+\s*\]", "", text)
    text = re.sub(r"\[\s*edit\s*\]", "", text, flags=re.IGNORECASE)
    return text.strip()


def fetch_soup(url: str) -> BeautifulSoup:
    logger.info("Fetching %s", url)
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "html.parser")


def extract_year(text: str) -> int | None:
    match = re.search(r"(1[5-9]\d{2}|20\d{2})", text)
    return int(match.group(1)) if match else None


def map_columns(header_cells: list, aliases: dict) -> dict:
    """Match each field to the header containing its longest/most specific
    alias first, and never reuse a column already claimed by another field
    (e.g. "Name of college" and "Festival name" both contain "name", so a
    bare "name" alias must not steal both)."""
    headers = [clean_text(c.get_text(strip=True)).lower() for c in header_cells]
    ranked_aliases = {
        field: sorted(field_aliases, key=len, reverse=True) for field, field_aliases in aliases.items()
    }

    mapping = {}
    claimed = set()
    # Resolve fields whose best available alias match is most specific first,
    # so e.g. "college" (in "institution") wins its column before the
    # generic "name" alias (in "name") gets a chance to also claim it.
    remaining = list(ranked_aliases.items())
    progressed = True
    while remaining and progressed:
        progressed = False
        still_remaining = []
        for field, field_aliases in remaining:
            match = None
            for alias in field_aliases:
                for idx, header in enumerate(headers):
                    if idx in claimed:
                        continue
                    if alias in header:
                        match = idx
                        break
                if match is not None:
                    break
            if match is not None:
                mapping[field] = match
                claimed.add(match)
                progressed = True
            else:
                still_remaining.append((field, field_aliases))
        remaining = still_remaining
    return mapping


def scrape_source_a() -> list[dict]:
    """One row per festival: State/UT, Location, College, Festival, Type, First Held."""
    soup = fetch_soup(SOURCE_A_URL)
    content = soup.find("div", class_="mw-parser-output") or soup
    tables = content.find_all("table", class_=lambda c: c and "wikitable" in c)

    records = []
    for table in tables:
        rows = table.find_all("tr")
        if not rows:
            continue
        columns = map_columns(rows[0].find_all(["th", "td"]), SOURCE_A_ALIASES)
        if "name" not in columns or "institution" not in columns:
            continue

        for row in rows[1:]:
            cells = row.find_all(["td", "th"])
            if len(cells) <= columns["name"]:
                continue

            def cell_text(field):
                idx = columns.get(field)
                if idx is None or idx >= len(cells):
                    return None
                value = clean_text(cells[idx].get_text(strip=True))
                return value or None

            name = cell_text("name")
            institution = cell_text("institution")
            if not name or not institution:
                continue

            first_held_raw = cell_text("first_held")
            records.append({
                "name": name,
                "host_institution": institution,
                "state": cell_text("state"),
                "location": cell_text("location"),
                "festival_type": cell_text("festival_type"),
                "first_held": extract_year(first_held_raw) if first_held_raw else None,
                "official_website": None,
                "data_source": "Wikipedia: List of festivals in Indian colleges",
            })

    logger.info("Source A: %d festival rows", len(records))
    return records


def resolve_header_grid(rows, num_header_rows: int) -> list[list[str | None]]:
    """Flatten a colspan/rowspan multi-row HTML header into a per-header-row
    list of (flat column index -> label), so a grouped header like
    "Cultural festival" spanning "Name"/"First held" sub-columns lands at
    the correct flat positions instead of being read as one column."""
    grid: list[list[str | None]] = [[] for _ in range(num_header_rows)]
    occupied: list[dict] = [dict() for _ in range(num_header_rows)]

    def ensure_len(row_list, length):
        if len(row_list) < length:
            row_list.extend([None] * (length - len(row_list)))

    for r in range(num_header_rows):
        cells = rows[r].find_all(["th", "td"])
        col = 0
        for cell in cells:
            while occupied[r].get(col):
                col += 1
            text = clean_text(cell.get_text(strip=True))
            colspan = int(cell.get("colspan", 1) or 1)
            rowspan = int(cell.get("rowspan", 1) or 1)
            for dc in range(colspan):
                c = col + dc
                ensure_len(grid[r], c + 1)
                grid[r][c] = text
                for dr in range(1, rowspan):
                    if r + dr < num_header_rows:
                        occupied[r + dr][c] = True
                        ensure_len(grid[r + dr], c + 1)
                        grid[r + dr][c] = text
            col += colspan
    return grid


def scrape_source_b() -> list[dict]:
    """One row per institute (IIT or NIT), with a Name/First-held column
    pair per festival type. Header spans two rows via colspan/rowspan."""
    soup = fetch_soup(SOURCE_B_URL)
    content = soup.find("div", class_="mw-parser-output") or soup
    tables = content.find_all("table", class_=lambda c: c and "wikitable" in c)

    records = []
    for table in tables:
        rows = table.find_all("tr")
        if len(rows) < 3:
            continue

        grid = resolve_header_grid(rows, num_header_rows=2)
        width = max(len(grid[0]), len(grid[1]))
        combined = []
        for c in range(width):
            parts = [g[c] for g in grid if c < len(g) and g[c]]
            combined.append(" ".join(dict.fromkeys(parts)).lower())

        institution_idx = next(
            (i for i, h in enumerate(combined) if "institut" in h or "name of" in h),
            None,
        )
        state_idx = next((i for i, h in enumerate(combined) if "state" in h), None)
        location_idx = next((i for i, h in enumerate(combined) if "location" in h or "city" in h), None)

        # Group flat columns into {festival_type: {name_idx, year_idx}}
        type_groups: dict[str, dict] = {}
        for i, h in enumerate(combined):
            for keyword in FEST_TYPE_COLUMN_KEYWORDS:
                if keyword in h:
                    fest_type = keyword.capitalize()
                    group = type_groups.setdefault(fest_type, {})
                    if "name" in h:
                        group["name_idx"] = i
                    elif "held" in h or "year" in h:
                        group["year_idx"] = i
                    break

        if institution_idx is None or not type_groups:
            logger.warning("Skipping a table in source B: could not resolve headers dynamically")
            continue

        for row in rows[2:]:
            cells = row.find_all(["td", "th"])
            if len(cells) <= institution_idx:
                continue

            def cell_at(idx):
                if idx is None or idx >= len(cells):
                    return None
                value = clean_text(cells[idx].get_text(strip=True))
                return value or None

            institution = cell_at(institution_idx)
            if not institution:
                continue
            state = cell_at(state_idx)
            location = cell_at(location_idx)

            for fest_type, group in type_groups.items():
                name = cell_at(group.get("name_idx"))
                if not name or name in ("-", "—", "–"):
                    continue
                year_raw = cell_at(group.get("year_idx"))
                records.append({
                    "name": name,
                    "host_institution": institution,
                    "state": state,
                    "location": location,
                    "festival_type": fest_type,
                    "first_held": extract_year(year_raw) if year_raw else None,
                    "official_website": None,
                    "data_source": "Wikipedia: List of cultural, technical and sports festivals in IITs and NITs",
                })

    logger.info("Source B: %d festival rows", len(records))
    return records


def merge_and_dedupe(*record_lists: list[dict]) -> list[dict]:
    seen = {}
    for records in record_lists:
        for record in records:
            key = (record["name"].lower(), record["host_institution"].lower())
            if key not in seen:
                seen[key] = record
            else:
                # Prefer whichever record has more filled-in fields
                existing = seen[key]
                if sum(v is not None for v in record.values()) > sum(v is not None for v in existing.values()):
                    seen[key] = record
    return list(seen.values())


def main():
    source_a = scrape_source_a()
    source_b = scrape_source_b()
    merged = merge_and_dedupe(source_a, source_b)

    if not merged:
        logger.error("No festivals scraped - leaving any existing output file untouched.")
        return

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
    logger.info("Wrote %d unique festivals to %s", len(merged), OUTPUT_PATH)


if __name__ == "__main__":
    main()
