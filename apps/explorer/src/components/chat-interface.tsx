'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { Check, Copy, Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

type CodeComponent = Components['code'];

interface CodeComponentProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface DocumentMatch {
  content: string;
  metadata: Record<string, string>;
  score?: number;
}

interface ChatResponse {
  answer: string;
  matches: DocumentMatch[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setProgress(0);

    try {
      const response = await axios.post<ChatResponse>(new URL('api/documents/chat', process.env.NEXT_PUBLIC_API_URL).href, {
        query: input,
        limit: 5,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.answer,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setProgress(100);
      inputRef.current?.focus();
    }
  };

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderMarkdown = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: (({ inline, className, children, ...props }: CodeComponentProps) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus as { [key: string]: React.CSSProperties }}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }) as CodeComponent,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        a: ({ node, ...props }) => (
          <a
            className="text-blue-500 hover:text-blue-700 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-4 my-2" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-4 my-2" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        li: ({ node, ...props }) => (
          <li className="my-1" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        p: ({ node, ...props }) => (
          <p className="my-2" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold my-4" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold my-3" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-bold my-2" {...props} />
        ),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] bg-background">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <Card
              className={`max-w-[90%] sm:max-w-[80%] p-2 sm:p-4 ${message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-card-foreground'
                }`}
            >
              <div className="flex items-start space-x-2">
                <Avatar>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center">
                    {message.role === 'user' ? 'U' : 'A'}
                  </div>
                </Avatar>
                <div className="flex-1">
                  {message.role === 'assistant' && (
                    <div className="flex justify-end mb-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(message.content, message.id)}
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  {renderMarkdown(message.content)}
                </div>
              </div>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card text-card-foreground p-2 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <Progress value={progress} className="w-[100px] sm:w-[200px]" />
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-background border-t">
        <form onSubmit={handleSubmit} className="p-2 sm:p-4">
          <div className="flex space-x-2 sm:space-x-4">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about Paul Graham's essays..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="icon">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
