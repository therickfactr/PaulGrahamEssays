import requests

from bs4 import BeautifulSoup
from dotenv import load_dotenv
from html2text import HTML2Text
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from os import environ
from supabase.client import create_client
from tqdm import tqdm
from typing import Iterator, List

load_dotenv()

DOCUMENT_LIST_URL = environ.get("DOCUMENT_LIST_URL")
if not DOCUMENT_LIST_URL:
    raise ValueError("DOCUMENT_URL is not set")

OPENAI_MODEL = environ.get("OPENAI_MODEL")
if not OPENAI_MODEL:
    raise ValueError("OPENAI_MODEL is not set")

SUPABASE_URL = environ.get("SUPABASE_URL")
if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL is not set")

SUPABASE_KEY = environ.get("SUPABASE_KEY")
if not SUPABASE_KEY:
    raise ValueError("SUPABASE_KEY is not set")

from langchain_community.document_loaders import WebBaseLoader

    # Initialize HTML to text converter
text_converter = HTML2Text()
text_converter.ignore_links = True
text_converter.ignore_images = True
text_converter.ignore_emphasis = True

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

document_count = 0
chunk_count = 0

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
        anchor_tags = (
            tag for tag in set(soup.find_all('a')) 
            if  tag['href']
            and tag['href'] not in ['index.html', 'rss.html']
        )

        for anchor in anchor_tags:
            href = anchor.get('href')
            yield requests.compat.urljoin(base_url, href)

    except Exception as e:
        print(f"{get_document_list.__name__}: Error parsing index page: {e}")
        raise

def store_documents(urls: List[str] | Iterator[str]):
    """
    Generator that fetches documents from the given URLs and returns them as
    LangChain Document objects.
    """
    # Initialize global variables
    global document_count
    global chunk_count

    try:
        # Initialize OpenAI embeddings
        openai_model = OpenAIEmbeddings(model=OPENAI_MODEL)

        # Initialize Supabase client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        vector_store = SupabaseVectorStore(
            supabase_client,
            openai_model,
            "documents",
            1000,
            "match_documents",
        )

        # Convert iterator to list if it is an iterator
        if isinstance(urls, Iterator):
            urls = list(urls)
    
        # Initialize loader
        loader = WebBaseLoader(web_paths=urls)

        # Initialize text splitter
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

        # Create a progress bar
        progress_bar = tqdm(loader.load(), total=len(urls), desc="Processing documents")

        # Iterate over documents
        for document in progress_bar:
            # Increment the document count
            document_count += 1

            # save the essay content to the database
            supabase_client.table("essays").insert({
                "title": document.metadata["title"],
                "url": document.metadata["source"],
                "content": document.pageContent
            })

            # split document into chunks
            chunks = []
            for chunk in text_splitter.split_documents([document]):
                # Increment the chunk count
                chunk_count += 1

                # Add chunk to documents
                chunks.append(chunk)

            # Add chunks to vector store
            vector_store.add_documents(chunks)

    except Exception as e:
        print(f"{store_documents.__name__}: Error storing documents: {e}")
        raise

def main():
    urls = get_document_list(DOCUMENT_LIST_URL)
    store_documents(urls)

    # Print the results
    print("Sucesfully stored {:,} documents and {:,} chunks".format(document_count, chunk_count))

if __name__ == "__main__":
    main()
