# Document Management API

A REST API for managing documents with vector search capabilities using Express.js, TypeScript, and Supabase Vector Store.

## Features

- CRUD operations for documents
- Vector-based document matching
- TypeScript support
- Express.js framework
- Supabase integration for vector storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- OpenAI API key (for embeddings)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_TABLE=documents
   OPENAI_API_KEY=your_OPENAI_API_KEY
   ```

## Development

To run the development server:
```bash
npm run dev
```

## Building

To build the project:
```bash
npm run build
```

## Production

To run the production server:
```bash
npm start
```

## API Endpoints

### Documents

- `GET /documents` - Get all documents
- `GET /documents/:id` - Get a specific document
- `POST /documents` - Create a new document
- `PUT /documents/:id` - Update a document
- `DELETE /documents/:id` - Delete a document
- `POST /documents/match` - Find similar documents

### Example Requests

#### Create Document
```bash
curl -X POST http://localhost:3000/documents \
  -H "Content-Type: application/json" \
  -d '{"content": "Your document content", "metadata": {"title": "Example"}}'
```

#### Match Documents
```bash
curl -X POST http://localhost:3000/documents/match \
  -H "Content-Type: application/json" \
  -d '{"query": "search query", "k": 5}'
```
