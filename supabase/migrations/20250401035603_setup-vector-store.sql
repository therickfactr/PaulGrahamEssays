-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  content text,  -- corresponds to Document.pageContent
  metadata jsonb,  -- corresponds to Document.metadata
  embedding vector(1536)  -- 1536 works for OpenAI embeddings, change if needed
);

-- create index on the embedding column for faster search
create index documents_embedding_idx on documents using hnsw (embedding vector_cosine_ops);

-- Create a function to search for documents
create function match_documents(query_embedding vector(1536), match_count int)
returns table(id bigint, content text, metadata jsonb, similarity float)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    jsonb_set(metadata,'{record_id}'::text[],('"' || id || '"')::jsonb, true) metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$
;
