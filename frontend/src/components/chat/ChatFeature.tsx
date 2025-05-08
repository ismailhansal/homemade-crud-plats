
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "cook" | "delivery";
  timestamp: Date;
}

const ChatFeature = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your delivery person for today's orders. Let me know if you have any specific instructions.",
      sender: "delivery",
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add cook's message
    const cookMessage: Message = {
      id: messages.length + 1,
      text: newMessage.trim(),
      sender: "cook",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cookMessage]);
    setNewMessage("");

    // Simulate delivery person's response after 1 second
    setTimeout(() => {
      const responses = [
        "I'll make sure to deliver it on time!",
        "Got it, thanks for letting me know.",
        "I'm about 10 minutes away from your location.",
        "Is there a specific place you'd like me to leave the order?",
        "Do you have any delivery instructions?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const deliveryMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "delivery",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, deliveryMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'cook' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {message.sender === 'delivery' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80" />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`rounded-lg p-3 ${
                message.sender === 'cook' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">{formatTime(message.timestamp)}</p>
              </div>
              
              {message.sender === 'cook' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=80&h=80" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatFeature;
