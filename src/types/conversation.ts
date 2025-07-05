
export interface StorableChatMessage {
  id: string;
  session_id: string;
  message: string;
  sender: 'user' | 'nujmooz';
  language: string;
  created_at: string;
}

export interface StorableConversationData {
  title: string;
  messages: StorableChatMessage[];
  language: 'en' | 'ar';
  session_id: string;
  created_at: string;
  updated_at: string;
}

export interface SavedConversation {
  id: string;
  title: string;
  messages: StorableChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  language: 'en' | 'ar';
  sessionId: string;
}
