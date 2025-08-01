import os
import json
import requests
from bs4 import BeautifulSoup
from google_search_results import GoogleSearch


def scrape_and_clean_text(url):
    """
    Fetches content from a URL, parses it with BeautifulSoup,
    and returns cleaned text content.
    """
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        for script_or_style in soup(['script', 'style']):
            script_or_style.decompose()

        text = ' '.join(soup.stripped_strings)
        return text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
        return None

api_key = os.environ.get("SERPAPI_API_KEY")
if not api_key:
    raise ValueError("SERPAPI_API_KEY environment variable not set")

query = "What is Retrieval-Augmented Generation (RAG)?"

params = {
    "q": query,
    "engine": "google",
    "api_key": api_key,
}

print(f"Performing search for: '{query}'")
search = GoogleSearch(params)
results = search.get_dict()

first_result_url = None
if 'organic_results' in results and results['organic_results']:
    first_result = results['organic_results'][0]
    first_result_url = first_result.get('link')
    print(f"\nFound top result: '{first_result.get('title')}'")
    print(f"URL: {first_result_url}")
else:
    print("No organic results found.")

if first_result_url:
    print("\nScraping content from the top result...")
    scraped_content = scrape_and_clean_text(first_result_url)

    if scraped_content:
        print("\n--- Scraped Content (First 500 chars) ---")
        print(scraped_content[:500] + "...")
        print("\n--- Preparing Prompt for LLM ---")

        prompt = f"""
        Based on the following context, please provide a concise summary of what Retrieval-Augmented Generation (RAG) is.

        Context:
        "{scraped_content}"

        Summary:
        """

        print(prompt)
        print("\nThis prompt would now be sent to an LLM to get a generated summary.")