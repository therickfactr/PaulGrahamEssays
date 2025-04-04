# Paul Graham Essays Explorer

A modern web application that allows users to explore and interact with Paul Graham's essays using natural language. Built with Next.js, TypeScript, and powered by OpenAI's GPT-4.

## Features

- 🔍 Semantic search across Paul Graham's essay collection
- 💬 Natural language chat interface for asking questions
- 📚 Context-aware responses with source attribution
- 🎨 Modern UI with responsive design
- 📱 Mobile-friendly interface

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
├── render.yaml           # Render.com deployment configuration
└── package.json         # Root package.json for workspace
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
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
   yarn install
   ```

3. Set up environment variables:
   - Create `.env` files in both `apps/api` and `apps/explorer`
   - See `.env.example` files for required variables

4. Start the development servers:
   ```bash
   # Start the API server
   cd apps/api
   yarn dev

   # Start the Explorer app
   cd apps/explorer
   yarn dev
   ```

5. Access the applications:
   - API: http://localhost:3001
   - Explorer: http://localhost:3000

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
4. Render will automatically deploy both services

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

- Paul Graham for his insightful essays
- OpenAI for the GPT-4 model
- The open-source community for the amazing tools and libraries 