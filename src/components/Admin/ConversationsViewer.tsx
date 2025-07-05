
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Calendar, User, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface Conversation {
  id: string;
  session_id: string;
  sender: string;
  message: string;
  language: string | null;
  created_at: string;
}

const ConversationsViewer: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.session_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedConversations = filteredConversations.reduce((acc, conv) => {
    if (!acc[conv.session_id]) {
      acc[conv.session_id] = [];
    }
    acc[conv.session_id].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading conversations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            المحادثات
          </CardTitle>
          <CardDescription>
            عرض وإدارة محادثات العملاء مع نجموز
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="البحث في المحادثات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="text-sm text-gray-600">
              إجمالي الجلسات: {Object.keys(groupedConversations).length}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {Object.entries(groupedConversations).map(([sessionId, sessionConversations]) => (
          <Card key={sessionId}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">جلسة: {sessionId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {sessionConversations.length} رسالة
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(sessionConversations[0].created_at).toLocaleDateString('ar')}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessionConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg ${
                      conv.sender === 'user' 
                        ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                        : 'bg-green-50 border-l-4 border-l-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={conv.sender === 'user' ? 'default' : 'secondary'}>
                        {conv.sender === 'user' ? 'العميل' : 'نجموز'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {conv.language && (
                          <Badge variant="outline" className="text-xs">
                            {conv.language}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(conv.created_at).toLocaleTimeString('ar')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap" dir="auto">
                      {conv.message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(groupedConversations).length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد محادثات متاحة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationsViewer;
