import json

from bs4 import BeautifulSoup
from html2text import HTML2Text
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from typing import Generator, Iterator, List

def fetch_documents(urls: List[tuple[str, str]] | Iterator[tuple[str, str]]) -> Generator[Document, None, None]:
    """
    Generator that fetches documents from the given URLs and returns them as
    LangChain Document objects.
    """
    # Initialize HTML to text converter
    text_converter = HTML2Text()
    text_converter.ignore_links = True
    text_converter.ignore_images = True
    text_converter.ignore_emphasis = True

    for data in urls:
        url, title = data
        try:
            # Load document content
            loader = WebBaseLoader(url)
            documents = []
            for document in loader.load():
                documents.append(document)

            document = documents[0]

            document.page_content = text_converter.handle(document.page_content)
            document.metadata['title'] = title

            yield document

        except Exception as e:
            print(f"{fetch_documents.__name__}: Error fetching document {url}: {e}")
            continue

if __name__ == "__main__":
    # Example usage
    urls = [
        ["https://www.paulgraham.com/fix.html", "fix it"],
        ["https://www.paulgraham.com/greatwork.html", "great work"],
        ["https://www.paulgraham.com/goodwork.html", "good work"],
    ]
    n = 0
    for document in fetch_documents(urls):
        print(f"{n}: {json.dumps(document.__dict__)}")
        n += 1
