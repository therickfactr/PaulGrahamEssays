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
│   │   │   │   ├── chat.ts        # Chat endpoints
│   │   │   │   ├── document.ts    # Document CRUD and search
│   │   │   │   └── health.ts      # Health check endpoint
│   │   │   ├── services/ # Business logic
│   │   │   │   ├── documentService.ts  # Document search and processing
│   │   │   │   └── llmService.ts       # LLM integration and response generation
│   │   │   ├── types/    # TypeScript interfaces
│   │   │   │   ├── chat.ts       # Chat-related types
│   │   │   │   └── document.ts   # Document-related types
│   │   │   └── lib/      # Utilities and configurations
│   │   │       ├── supabase.ts   # Supabase client setup
│   │   │       └── vectorStore.ts # Vector store initialization
│   │   └── package.json
│   │
│   └── explorer/         # Next.js frontend
│       ├── src/
│       │   ├── app/      # Next.js app router
│       │   │   ├── layout.tsx     # Root layout
│       │   │   └── page.tsx       # Main page
│       │   ├── components/ # React components
│       │   │   ├── chat-interface.tsx  # Chat UI component
│       │   │   ├── ui/            # Reusable UI components
│       │   │   └── ...            # Other components
│       │   └── lib/      # Utilities
│       │       └── api.ts         # API client configuration
│       └── package.json
│
├── loader/               # Python-based essay processing
│   ├── src/
│   │   ├── loaders/     # Essay loading scripts
│   │   │   └── essay_loader.py    # Main essay loading script
│   │   ├── processors/  # Text processing utilities
│   │   │   └── text_processor.py  # Text cleaning and chunking
│   │   └── utils/       # Helper functions
│   │       └── supabase.py        # Supabase utilities
│   └── requirements.txt
│
├── supabase/            # Database migrations and functions
│   ├── migrations/      # SQL migrations
│   └── functions/       # Database functions
│
├── render.yaml          # Render.com deployment configuration
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
   cd PaulGrahamEssays
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
   - API: http://localhost:3081
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

## Suggested Prompts

Try these prompts to explore Paul Graham's essays:

- [What is a good founder?](docs/GOODFOUNDER.md)
- [What is an angel investor and what do they do?](docs/ANGELINVESTOR.md)
- [What kinds of work are there?](docs/KINDSOFWORK.md)
- [What is truth?](docs/TRUTH.md)
- [What makes a person stubborn?](docs/STUBBORN.md)
- [What is going on in Pittsburgh?](docs/PITTSBURGH.md)

Each prompt link leads to an example response that demonstrates the system's capabilities.

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
- [Bluebook Accounting](https://getbluebook.com) for the challenge! See [Requirements](./REQUIREMENTS.md)
