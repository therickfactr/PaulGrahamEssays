import requests

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from html2text import HTML2Text
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from os import environ
from supabase.client import create_client
from typing import Iterator, List

load_dotenv()

from langchain_community.document_loaders import WebBaseLoader

    # Initialize HTML to text converter
text_converter = HTML2Text()
text_converter.ignore_links = True
text_converter.ignore_images = True
text_converter.ignore_emphasis = True

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

def get_document_list(url: str) -> Iterator[str]:
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

        # Find all anchor tags and remove duplicates
        anchor_tags = set(soup.find_all('a'))

        for anchor in anchor_tags:
            href = anchor.get('href')
            if not href or href in ['index.html', 'rss.html']:
                continue
            yield requests.compat.urljoin(base_url, href)

    except Exception as e:
        print(f"{get_document_list.__name__}: Error parsing index page: {e}")
        raise

def store_documents(urls: List[str] | Iterator[str]) -> SupabaseVectorStore:
    """
    Generator that fetches documents from the given URLs and returns them as
    LangChain Document objects.
    """
    try:
        # Initialize OpenAI embeddings
        openai_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

        # Initialize Supabase client
        supabase_client = create_client(environ.get("SUPABASE_URL"), environ.get("SUPABASE_SERVICE_KEY"))
        vector_store = SupabaseVectorStore(
            supabase_client,
            openai_embeddings,
            "documents",
            1000,
            "match_documents",
        )

        for url in urls:
            # Load document content
            loader = WebBaseLoader(web_path=url, )
            documents = []
            for document in loader.load_and_split(text_splitter):
                documents.append(document)

            vector_store.add_documents(documents)

        return vector_store

    except Exception as e:
        print(f"{store_documents.__name__}: Error storing documents {url}: {e}")
        raise

if __name__ == "__main__":
    # Example usage
    urls = []

    if not environ.get("DOCUMENT_LIST_URL"):

    
        urls = get_document_list(environ.get("DOCUMENT_LIST_URL"))
    else:
        urls = [
            ["https://www.paulgraham.com/fix.html", "fix it"],
            ["https://www.paulgraham.com/greatwork.html", "great work"],
            ["https://www.paulgraham.com/goodwork.html", "good work"],
        ]

    vector_store = store_documents(urls)

    print(f"Vector store: {vector_store}")
