import requests

from bs4 import BeautifulSoup
from html2text import HTML2Text
from typing import Any, Dict, Iterable, Tuple

# Initialize HTML to text converter for titles
text_converter = HTML2Text()
text_converter.ignore_links = True
text_converter.ignore_images = True
text_converter.ignore_emphasis = True

def parse_index(url: str) -> Iterable[Tuple[str, str]]:
    """
    Generator that returns the URL of every document linked in an
    <a href=... /> tag on the Web page at {url}.
    
    Yields:
        a string containing the URL for one linked document
    """
    # Get the base URL for converting relative URLs to absolute
    base_url = requests.compat.urljoin(url, '.')
    try:
        # Fetch the document list page
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all anchor tags
        anchor_tags = soup.find_all('a')

        for anchor in anchor_tags:
            href = anchor.get('href')
            if not href or href in ['index.html', 'rss.html']:
                continue
            yield requests.compat.urljoin(base_url, href), text_converter.handle(str(anchor.decode_contents()))

        # Yield the URLs from the href attributes
    except Exception as e:
        print(f"{parse_index.__name__}: Error parsing index page: {e}")
        raise
    
if __name__ == "__main__":
    # Example usage
    url = "https://www.paulgraham.com/articles.html"
    n = 0
    for url in parse_index(url):
        print(f"{n}: {url}")
        n += 1
