# Paul Graham Essays Document Loader

A Python script that scrapes Paul Graham's essays from his website, processes them, and stores them in a Supabase vector database for semantic search capabilities.

## Features

- Web scraping of Paul Graham's essays
- HTML to text conversion with formatting preservation
- Document chunking with overlap for better context
- Vector embeddings using OpenAI's API
- Storage in Supabase vector database
- Progress tracking with tqdm
- Error handling and logging

## Prerequisites

- Python 3.8 or higher
- Supabase account and project
- OpenAI API key
- Virtual environment (recommended)

## Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Unix/macOS
   # or
   .venv\Scripts\activate  # On Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DOCUMENT_LIST_URL=http://www.paulgraham.com/articles.html
   OPENAI_MODEL=text-embedding-3-small
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_SUPABASE_KEY
   DOCUMENT_CHUNK_SIZE=1000
   DOCUMENT_CHUNK_OVERLAP_SIZE=150
   ```

## Usage

Run the script to load and process all essays:
```bash
python load_documents.py
```

The script will:
1. Fetch the list of essays from Paul Graham's website
2. Process each essay, converting HTML to text
3. Split the text into chunks with overlap
4. Generate embeddings for each chunk
5. Store the chunks in the Supabase vector database
6. Display progress and final statistics

## Configuration

The following environment variables can be configured:

- `DOCUMENT_LIST_URL`: URL of the page containing the list of essays
- `OPENAI_MODEL`: OpenAI model to use for embeddings
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase service role key
- `DOCUMENT_CHUNK_SIZE`: Size of each text chunk (default: 1000)
- `DOCUMENT_CHUNK_OVERLAP_SIZE`: Overlap between chunks (default: 150)

## Dependencies

- beautifulsoup4: HTML parsing
- html2text: HTML to text conversion
- langchain-community: Vector store integration
- langchain-openai: OpenAI embeddings
- langchain-text-splitters: Text chunking
- requests: HTTP requests
- supabase: Supabase client
- tqdm: Progress bars
- typing: Type hints

## Error Handling

The script includes error handling for:
- Network requests
- HTML parsing
- Document processing
- Database operations

Errors are logged with descriptive messages to help with debugging.

## Output

The script will output:
- Progress bars for document processing
- Final statistics showing the number of documents and chunks processed
- Any errors that occur during execution