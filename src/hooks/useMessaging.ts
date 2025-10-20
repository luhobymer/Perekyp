import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: User;
  receiver: User;
}

interface UseMessagingResult {
  loading: boolean;
  error: string | null;
  messages: Message[];
  unreadCount: number;
  getMessages: (userId: string) => Promise<Message[]>;
  getMessage: (messageId: string) => Promise<Message>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<Message>;
  markAsRead: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
}

export const useMessaging = (): UseMessagingResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Отримання списку повідомлень
  const getMessages = useCallback(async (userId: string): Promise<Message[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            email,
            full_name
          ),
          receiver:receiver_id (
            id,
            email,
            full_name
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const messagesData = data as Message[];
      setMessages(messagesData);
      setUnreadCount(messagesData.filter(msg => !msg.read && msg.receiver_id === userId).length);

      return messagesData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Отримання повідомлення
  const getMessage = useCallback(async (messageId: string): Promise<Message> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            email,
            full_name
          ),
          receiver:receiver_id (
            id,
            email,
            full_name
          )
        `)
        .eq('id', messageId)
        .single();

      if (fetchError) throw fetchError;

      return data as Message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Відправка повідомлення
  const sendMessage = useCallback(async (
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          read: false
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Оновлюємо список повідомлень
      await getMessages(senderId);

      return data as Message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMessages]);

  // Позначення повідомлення як прочитаного
  const markAsRead = useCallback(async (messageId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Оновлюємо стан повідомлень
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Видалення повідомлення
  const deleteMessage = useCallback(async (messageId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) throw deleteError;

      // Оновлюємо стан повідомлень
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    messages,
    unreadCount,
    getMessages,
    getMessage,
    sendMessage,
    markAsRead,
    deleteMessage,
  };
};

export default useMessaging;
