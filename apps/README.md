# Paul Graham Essays Explorer

A combined application that provides both the API and frontend for exploring Paul Graham's essays using semantic search capabilities.

## Features

### API Features
- CRUD operations for documents
- Vector-based document matching
- TypeScript support with strict type checking
- Express.js framework
- Supabase integration for vector storage
- Webpack bundling for production builds
- Source maps for debugging

### Frontend Features
- Modern UI built with Next.js and React 18
- Semantic search across Paul Graham's essays
- Real-time chat interface
- Shadcn UI components for consistent design
- Integration with local REST API

## Project Structure

```
explorer/
├── src/
│   ├── api/        # API source files
│   ├── app/        # Frontend source files
│   └── shared/     # Shared utilities and types
├── public/         # Static assets
├── dist/           # Compiled output
├── node_modules/   # Dependencies
├── package.json    # Project configuration
├── tsconfig.json   # TypeScript configuration
├── webpack.config.js # Webpack configuration
└── next.config.js  # Next.js configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project
- OpenAI API key (for embeddings)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # API Configuration
   PORT=3081
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_TABLE=documents
   OPENAI_API_KEY=your_openai_api_key

   # App Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3081
   ```

## Development

To run both the API and frontend in development mode:
```bash
npm run dev
```

To run only the API:
```bash
npm run dev:api
```

To run only the frontend:
```bash
npm run dev:app
```

## Building

The build process includes:
1. Cleaning the dist directory
2. TypeScript compilation
3. Webpack bundling for API
4. Next.js build for frontend

To build the entire project:
```bash
npm run build
```

To build only the API:
```bash
npm run build:api
```

To build only the frontend:
```bash
npm run build:app
```

## Production

To run both the API and frontend in production mode:
```bash
npm run start
```

To run only the API:
```bash
npm run start:api
```

To run only the frontend:
```bash
npm run start:app
```

## TypeScript Configuration

The project uses TypeScript with the following key configurations:
- Strict type checking enabled
- Source maps for debugging
- Declaration files generated
- ES2020 target
- CommonJS modules
- Output directory set to `./dist`

## Development Tools

- `ts-node-dev` for API development with hot-reloading
- `next` for frontend development and production
- `webpack` for API production bundling
- `rimraf` for cleaning build output
- `concurrently` for running multiple processes
- `shadcn-ui` for UI components

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com) 