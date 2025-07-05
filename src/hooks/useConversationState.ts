
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export const useConversationState = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('ar');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome-1',
      sender: 'nujmooz',
      content: 'أهلًا وسهلًا! أنا نجموز 👽، شريكك الإبداعي الكوني من استوديو الفضاء ✨\n\nهنا لأساعدك تحول أفكارك إلى موجز مشروع واضح ومنظم. الفريق بيشوف الموجز بعدين ويتواصل معك.\n\nيلا نبدأ هذه الرحلة الإبداعية معًا! وش الفكرة اللي في بالك؟ 🚀',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateLastMessage = (content: string) => {
    setMessages(prev => 
      prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, content } : msg
      )
    );
  };

  const clearInput = () => {
    setInputMessage('');
  };

  const detectLanguage = (text: string): 'ar' | 'en' => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text) ? 'ar' : 'en';
  };

  return {
    // State
    messages,
    inputMessage,
    isLoading,
    currentLanguage,
    messagesEndRef,
    
    // Actions
    setMessages,
    setInputMessage,
    setIsLoading,
    setCurrentLanguage,
    addMessage,
    updateLastMessage,
    clearInput,
    detectLanguage,
    scrollToBottom
  };
};
