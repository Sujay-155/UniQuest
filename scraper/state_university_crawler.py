"""
Crawls Wikipedia's "List of state universities in India" and writes the
result to server/data/state_universities.json.

Nothing about the states or table layout is hardcoded: the page is organized
as one wikitable per state/UT, each preceded by a heading that names the
state, and each table's own header row is read at parse time to figure out
which column holds which field. If Wikipedia reorders or renames columns,
or adds/removes a state section, this script adapts without changes.

Fee structure and scholarships are NOT on this page, so those fields are
left empty rather than guessed - a student comparing real institutions
deserves missing data over invented data.
"""

import json
import logging
import os
import re

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WIKI_URL = "https://en.wikipedia.org/wiki/List_of_state_universities_in_India"
OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "server", "data", "state_universities.json"
)

HEADER_ALIASES = {
    "name": ["university", "name", "institution"],
    "location": ["location", "city", "headquarters", "district"],
    "established": ["established", "year", "founded"],
    "specialization": ["specialization", "specialisation", "type", "stream"],
}


def clean_text(text: str) -> str:
    text = re.sub(r"\[\s*\d+\s*\]", "", text)  # strip [1] style citation markers
    text = re.sub(r"\[\s*edit\s*\]", "", text, flags=re.IGNORECASE)
    return text.strip()


def find_state_heading(table) -> str | None:
    """Walk backwards from a table to the nearest heading naming its state."""
    node = table
    while node is not None:
        node = node.find_previous_sibling()
        if node is None:
            continue
        heading = None
        if node.name in ("h2", "h3", "h4"):
            heading = node
        elif node.name == "div" and "mw-heading" in (node.get("class") or []):
            heading = node.find(["h2", "h3", "h4"])
        if heading is not None:
            text = clean_text(heading.get_text(strip=True))
            if text and text.lower() not in ("see also", "references", "notes", "external links"):
                return text
    return None


def map_columns(header_row) -> dict:
    header_cells = header_row.find_all(["th", "td"])
    headers = [clean_text(c.get_text(strip=True)).lower() for c in header_cells]

    mapping = {}
    for field, aliases in HEADER_ALIASES.items():
        for idx, header in enumerate(headers):
            if any(alias in header for alias in aliases):
                mapping[field] = idx
                break
    return mapping


def parse_table(table, state_name: str) -> list[dict]:
    rows = table.find_all("tr")
    if not rows:
        return []

    columns = map_columns(rows[0])
    if "name" not in columns:
        logger.warning("Skipping a table under %s: no recognizable name column", state_name)
        return []

    universities = []
    for row in rows[1:]:
        cells = row.find_all(["td", "th"])
        if len(cells) <= columns["name"]:
            continue

        name = clean_text(cells[columns["name"]].get_text(strip=True))
        if not name:
            continue

        def cell_text(field):
            idx = columns.get(field)
            if idx is None or idx >= len(cells):
                return None
            value = clean_text(cells[idx].get_text(strip=True))
            return value or None

        established_raw = cell_text("established")
        established_year = None
        if established_raw:
            match = re.search(r"(1[5-9]\d{2}|20\d{2})", established_raw)
            if match:
                established_year = int(match.group(1))

        universities.append({
            "name": name,
            "state": state_name,
            "university_type": "State",
            "courses_offered": [],
            "official_website": None,
            "admission_portal_link": None,
            "application_deadline": None,
            "established_year": established_year,
            "location": cell_text("location"),
            "specialization": cell_text("specialization"),
            "fee_range": None,
            "scholarships_available": [],
            "data_source": "Wikipedia: List of state universities in India",
        })

    return universities


def scrape_state_universities() -> list[dict]:
    logger.info("Fetching %s", WIKI_URL)
    response = requests.get(
        WIKI_URL,
        headers={"User-Agent": "UniQuestCrawler/1.0 (educational project; contact via GitHub)"},
        timeout=30,
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    content = soup.find("div", class_="mw-parser-output") or soup
    tables = content.find_all("table", class_=lambda c: c and "wikitable" in c)
    logger.info("Found %d wikitable(s) on the page", len(tables))

    all_universities = []
    seen_states = set()
    for table in tables:
        state_name = find_state_heading(table)
        if not state_name:
            continue
        rows = parse_table(table, state_name)
        if rows:
            seen_states.add(state_name)
            all_universities.extend(rows)
            logger.info("  %-30s %d universities", state_name, len(rows))

    logger.info(
        "Total: %d universities across %d states/UTs", len(all_universities), len(seen_states)
    )
    return all_universities


def main():
    universities = scrape_state_universities()
    if not universities:
        logger.error("No universities scraped - leaving any existing output file untouched.")
        return

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(universities, f, indent=2, ensure_ascii=False)
    logger.info("Wrote %d records to %s", len(universities), OUTPUT_PATH)


if __name__ == "__main__":
    main()
