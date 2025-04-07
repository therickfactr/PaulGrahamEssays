# API Documentation

This is the API service for the Paul Graham Essays application. It provides endpoints for managing documents and performing semantic search.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration values.

3. Start the development server:
```bash
yarn dev
```

## API Endpoints

### Health Check
- `GET /api/healthz` - Check API health status

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/documents/match` - Find documents matching a query

### Chat
- `POST /api/chat` - Send a message to the chat endpoint

## Unit Testing

The API includes comprehensive unit tests using Jest. Tests are located in the `src/tests` directory.

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

### Test Structure

Tests are organized by controller:
- `health.test.ts` - Tests for health check endpoint
- `document.test.ts` - Tests for document management endpoints
- `chat.test.ts` - Tests for chat functionality

### Mocking

The tests use Jest's mocking capabilities to simulate external services:
- Supabase client is mocked for database operations
- Vector Store is mocked for semantic search operations

Example test structure:
```typescript
describe('Document Controller', () => {
    describe('listDocuments', () => {
        it('should return a list of documents', async () => {
            // Test implementation
        });
    });
});
```

### Test Coverage

The test suite aims to cover:
- Happy path scenarios
- Error handling
- Edge cases
- Input validation

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Run the following commands to check and fix code style:

```bash
# Check code style
yarn lint

# Fix code style issues
yarn lint:fix
```

### TypeScript

The project uses TypeScript for type safety. Run the following command to check types:

```bash
yarn typecheck
```

## Deployment

The API is deployed using Docker. Build and run the container:

```bash
# Build the Docker image
docker build -t paul-graham-essays-api .

# Run the container
docker run -p 3000:3000 paul-graham-essays-api
``` 