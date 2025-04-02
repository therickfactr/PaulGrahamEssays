# Supabase Configuration

This directory contains the Supabase configuration and setup files for the Paul Graham Essays project. Supabase is used as the backend database and vector store for storing and searching through Paul Graham's essays.

## Directory Structure

```
supabase/
├── config.toml     # Supabase CLI configuration
├── migrations/     # Database migrations
└── seed.sql       # Initial database seed data
```

## Features

- Vector storage for essay embeddings
- Document metadata storage
- Search functionality
- Database migrations
- Initial seed data

## Configuration

The Supabase configuration is managed through the following files:

- `config.toml`: Contains the Supabase CLI configuration settings
- `migrations/`: Contains SQL migration files for database schema changes
- `seed.sql`: Contains initial data to populate the database

## Database Schema

The database schema includes the following tables:

- `documents`: Stores the essay content and metadata
- `embeddings`: Stores vector embeddings for semantic search
- `metadata`: Stores additional document metadata

## Usage

### Local Development

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Start the local Supabase instance:
   ```bash
   supabase start
   ```

3. Apply migrations:
   ```bash
   supabase db reset
   ```

### Production

For production deployment, use the Supabase dashboard to:
1. Create a new project
2. Apply migrations
3. Configure environment variables

## Environment Variables

The following environment variables are required:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_TABLE=documents
```

## Integration

This Supabase configuration is used by:

- `api/`: REST API for document management
- `loader/`: Document loading and processing
- `app/`: Frontend application

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Vector Search Documentation](https://supabase.com/docs/guides/ai/vector-search) 