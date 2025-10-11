'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, X, Minus, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/context/auth-provider';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMessages([{ id: Date.now(), role: 'bot', text: 'Hello! How can I help you today?' }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check if user is trying to create a support ticket without being logged in
    const supportKeywords = ['bug', 'help', 'support', 'issue', 'problem', 'error', 'broken', 'not working', 'fix'];
    const needsSupport = supportKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    );

    if (needsSupport && !user) {
      const userMessageId = Date.now();
      const botMessageId = Date.now() + 1;
      const userMessage: Message = { 
        id: userMessageId, 
        role: 'user', 
        text: input 
      };
      const authMessage: Message = { 
        id: botMessageId, 
        role: 'bot', 
        text: 'To create a support ticket or get personalized help, please log in to your account first. You can continue chatting for general questions!' 
      };
      setMessages((prev) => [...prev, userMessage, authMessage]);
      setInput('');
      return;
    }

    const userMessage: Message = { id: Date.now(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userQuery = input;
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Get current messages for chat history
      const currentMessages = [...messages, userMessage];
      
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: userQuery,
          userEmail: user?.email || 'guest@rage.com',
          userName: user?.name || 'Guest User',
          chatHistory: currentMessages
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Add small delay to show typing indicator
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = await response.json();
      const botMessage: Message = { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: data.response || data.error || 'Sorry, I could not process your request.' 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Sorry, I am having trouble connecting. Please try again later.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
           <Button
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
            aria-label="Open support chat"
          >
            <Headphones className="h-7 w-7" />
          </Button>
        )}
        {isOpen && (
          <Card className="w-[350px] shadow-2xl rounded-lg flex flex-col h-[500px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
              <div className='flex items-center gap-2'>
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                </Avatar>
                <h3 className="font-semibold font-headline">Support Chat</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4 p-4" ref={scrollAreaRef}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex items-start gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'bot' && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-[75%] rounded-lg px-3 py-2 text-sm break-words overflow-wrap-anywhere hyphens-auto whitespace-pre-wrap',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        {message.text}
                      </div>
                      {message.role === 'user' && (
                         <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {(isLoading || isTyping) && (
                     <div className="flex items-start gap-3 justify-start">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                            </div>
                            <span className="text-xs text-gray-500">typing...</span>
                        </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="flex-shrink-0">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}