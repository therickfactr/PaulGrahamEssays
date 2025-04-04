# **Paul Graham Essay RAG-Stack**

## **Project Overview**

Build a ligthweight Retrieval Augmented Generation (RAG) system that provides intelligent search and analysis of Paul Graham's essays from [paulgraham.com/articles.html](https://paulgraham.com/articles.html).

## **Tech Stack**

- **Frontend**: Next.js with Shadcn UI components
- **Database**: Supabase (PostgreSQL) containerized with Docker/OrbStack
- **Backend, choose one of**:
    - TypeScript
    - Python

## **Core Components**

### **1. Data Ingestion Pipeline (Python)**

- [ ]  Scrapes essays from Paul Graham's website systematically
- [ ]  Stores processed data in Supabase (PostgreSQL + pgvector)

### **2. Search & RAG Interface (TypeScript)**

Implement an intuitive interface that:

- [ ]  Handles user queries and presents results in a chat UI in the Next.js frontend
- [ ]  Performs search across the essay database
- [ ]  [Optional] Generate summaries based on relevant essays using LLM
- [ ]  [Optional] Build an evalset of questions and golden answers to benchmark the implementation

## **Example Interaction**

**User Query**: "What makes a good founder?"

**Response**:

1. Relevant essay links with context:
    - [Founder Mode](https://paulgraham.com/foundermode.html)
    - [The Right Kind of Stubborn](https://paulgraham.com/persistence.html)
    - [How to Be a Founder](https://www.paulgraham.com/founders.html)
2. AI-generated synthesis of key insights from these essays:
    
    > A good founder operates differently from traditional managers, embracing **Founder Mode**—staying deeply involved in the company rather than relying solely on delegation [1]. They exhibit **persistent adaptability**, pushing through challenges while being open to change, unlike the blindly obstinate [2].
    > 
    > 
    > Key traits include **determination**, the resilience to overcome obstacles (e.g., WePay’s founders refusing to be ignored) [3], and **flexibility**, the ability to pivot when necessary (e.g., Daniel Gross shifting ideas multiple times) [3]. **Imagination** is crucial—great founders spot opportunities others dismiss (e.g., Airbnb) [3]. They also have a **rule-breaking streak**, bending conventions to their advantage [3]. Lastly, strong **co-founder relationships** help endure startup hardships (e.g., Twitch’s founders) [3].
    > 
    > In short, great founders stay hands-on, persist intelligently, adapt when needed, think originally, and challenge norms—all while building strong teams.
    > 
    > **References:**
    > 
    > [1] “Founder Mode”
    > 
    > [2] “The Right Kind of Stubborn”
    > 
    > [3] “What We Look for in Founders”
    >