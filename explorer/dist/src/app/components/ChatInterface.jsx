"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInterface = ChatInterface;
const react_1 = require("react");
const card_1 = require("@/app/components/ui/card");
const input_1 = require("@/app/components/ui/input");
const button_1 = require("@/app/components/ui/button");
const scroll_area_1 = require("@/app/components/ui/scroll-area");
const avatar_1 = require("@/app/components/ui/avatar");
const chatService_1 = require("@/app/services/chatService");
function ChatInterface() {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [input, setInput] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const scrollRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const response = await chatService_1.chatService.sendMessage({
                message: input,
                history: messages,
            });
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                content: response.message,
                role: 'assistant',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<card_1.Card className="w-full max-w-2xl mx-auto p-4">
      <scroll_area_1.ScrollArea ref={scrollRef} className="h-[500px] pr-4">
        <div className="space-y-4">
          {messages.map((message) => (<div key={message.id} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (<avatar_1.Avatar className="h-8 w-8">
                  <div className="h-full w-full bg-primary"/>
                </avatar_1.Avatar>)}
              <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'}`}>
                {message.content}
              </div>
              {message.role === 'user' && (<avatar_1.Avatar className="h-8 w-8">
                  <div className="h-full w-full bg-primary"/>
                </avatar_1.Avatar>)}
            </div>))}
        </div>
      </scroll_area_1.ScrollArea>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input_1.Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." disabled={isLoading}/>
        <button_1.Button type="submit" disabled={isLoading}>
          Send
        </button_1.Button>
      </form>
    </card_1.Card>);
}
//# sourceMappingURL=ChatInterface.jsx.map