import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from pymongo import MongoClient, UpdateOne
import os
import re

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client.uniquest_db
collection = db.universities

async def scrape_universities():
    async with async_playwright() as p:
        # Launch headless browser
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Target: Wikipedia's list of universities in India (highly structured and reliable for this demo)
        # We'll scrape Central Universities as a demonstration. 
        # In a full production script, you can expand this to State and Private by visiting their respective URLs.
        print("Navigating to the directory of Indian Central Universities...")
        
        target_url = "https://en.wikipedia.org/wiki/List_of_central_universities_in_India"
        await page.goto(target_url, timeout=60000)
        
        # Wait for the table to load
        await page.wait_for_selector("table.wikitable", timeout=15000)
        
        html = await page.content()
        soup = BeautifulSoup(html, 'html.parser')
        
        # Find the main data table
        tables = soup.find_all('table', class_='wikitable')
        
        scraped_data = []
        
        if tables:
            # The first wikitable typically contains the Central Universities list
            main_table = tables[0]
            rows = main_table.find_all('tr')[1:] # Skip header
            
            for row in rows:
                cols = row.find_all(['td', 'th'])
                if len(cols) >= 3:
                    # Wikipedia structure: Name (col 0 or 1), Location/State (col 2 or 3)
                    # This varies slightly, so we use robust extraction
                    
                    try:
                        # Extracting Name
                        name_cell = cols[1] # Usually the second column
                        name = name_cell.get_text(strip=True).split('[')[0]
                        
                        # Extracting State
                        state_cell = cols[3] # Usually the fourth column
                        state = state_cell.get_text(strip=True).split('[')[0]
                        
                        # Extracting Website if available
                        official_website = None
                        links = name_cell.find_all('a')
                        if links:
                            # Try to find a link that isn't a wikipedia internal link
                            for link in name_cell.find_all('a', class_='external text'):
                                official_website = link.get('href')
                        
                        if name and state:
                            # Mock some data for fields that aren't on this table
                            university = {
                                "name": name,
                                "state": state,
                                "university_type": "Central",
                                "courses_offered": ["B.Tech", "B.Sc", "MBA", "MA", "PhD"], # Mocked courses for MVP
                                "official_website": official_website or f"https://www.google.com/search?q={name.replace(' ', '+')}",
                                "admission_portal_link": official_website or f"https://www.google.com/search?q={name.replace(' ', '+')}+admissions",
                                "application_deadline": "2026-08-30" # Mocked deadline
                            }
                            scraped_data.append(university)
                    except Exception as e:
                        print(f"Skipping a row due to parsing error: {e}")
                        continue
        
        print(f"Extracted {len(scraped_data)} Central Universities.")
        
        # Update MongoDB avoiding duplicates using upsert
        if scraped_data:
            operations = []
            for uni in scraped_data:
                # Update by name to avoid inserting the same university twice
                operations.append(
                    UpdateOne(
                        {"name": uni["name"]}, 
                        {"$set": uni}, 
                        upsert=True
                    )
                )
            
            result = collection.bulk_write(operations)
            print(f"Database sync complete. Upserted {result.upserted_count} new universities, Modified {result.modified_count} existing records.")
        else:
            print("No data was scraped.")

        await browser.close()

if __name__ == "__main__":
    print("Starting UniQuest Indian Universities Scraper Pipeline...")
    asyncio.run(scrape_universities())

