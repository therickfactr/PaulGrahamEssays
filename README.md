# Paul Graham Essays Explorer

A modern web application that allows users to explore and interact with Paul Graham's essays using natural language. Built with Next.js, TypeScript, and powered by OpenAI's GPT-4.

## Features

- 🔍 Semantic search across Paul Graham's essay collection
- 💬 Natural language chat interface for asking questions
- 📚 Context-aware responses with source attribution
- 🎨 Modern UI with responsive design
- 📱 Mobile-friendly interface
- 📥 Automated essay loading and processing

## Tech Stack

### Frontend (Explorer App)
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Markdown with syntax highlighting

### Backend (API)
- Express.js
- TypeScript
- OpenAI GPT-4
- Supabase Vector Store
- LangChain

### Data Ingestion (Loader)
- Python
- BeautifulSoup4 for web scraping
- OpenAI embeddings
- Supabase integration
- Automated essay processing pipeline

## Project Structure

```
.
├── apps/
│   ├── api/              # Express.js backend API
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   └── lib/      # Utilities and configurations
│   │   └── package.json
│   │
│   └── explorer/         # Next.js frontend
│       ├── src/
│       │   ├── app/      # Next.js app router
│       │   ├── components/ # React components
│       │   └── lib/      # Utilities
│       └── package.json
│
├── loader/               # Python-based essay processing
│   ├── src/
│   │   ├── loaders/     # Essay loading scripts
│   │   ├── processors/  # Text processing utilities
│   │   └── utils/       # Helper functions
│   └── requirements.txt
│
├── render.yaml           # Render.com deployment configuration
└── package.json         # Root package.json for workspace
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Python 3.12+
- OpenAI API key
- Supabase account

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd paul-graham-essays
   ```

2. Install dependencies:
   ```bash
   # Install Node.js dependencies
   yarn install

   # Install Python dependencies
   cd loader
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create `.env` files in `apps/api`, `apps/explorer`, and `loader`
   - See `.env.example` files for required variables

4. Load the essays:
   ```bash
   cd loader
   python src/loaders/essay_loader.py
   ```

5. Start the development servers:
   ```bash
   # Start the API server
   cd apps/api
   yarn dev

   # Start the Explorer app
   cd apps/explorer
   yarn dev
   ```

6. Access the applications:
   - API: http://localhost:3001
   - Explorer: http://localhost:3000

## Data Processing

The Loader is a Python-based tool that:

1. Scrapes essays from paulgraham.com
2. Processes and cleans the text
3. Generates embeddings using OpenAI
4. Stores essays and embeddings in Supabase
5. Maintains metadata and relationships

### Key Features
- Automated essay discovery and loading
- Text cleaning and normalization
- Chunking for better search results
- Metadata extraction and storage
- Incremental updates for new essays

## Deployment

The project is configured for deployment on Render.com using the `render.yaml` file. The configuration includes:

- Separate services for API and Explorer app
- Automatic deployments from GitHub
- Health check endpoints
- Environment variable management

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Render.com
3. Configure environment variables in the Render dashboard
4. Run the Loader to populate the database
5. Render will automatically deploy both services

## API Endpoints

### Health Check
- `GET /api/health` - Service health status

### Documents
- `GET /api/documents/search` - Search essays
- `POST /api/documents/chat` - Chat with the essay collection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Paul Graham for his insightful [essays](https://www.paulgraham.com/articles.html)
- OpenAI for the GPT-4 model
- The open-source community for the amazing tools and libraries 
- [Bluebook Accounting](https://getbluebook.com) for the challenge! The requirements are online at [Paul Graham Essay RAG-Stack](https://bluebook-accounting.notion.site/Paul-Graham-Essay-RAG-Stack-1ba39a6192708044aa47cffb944b64bf)