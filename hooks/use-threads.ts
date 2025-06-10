import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Thread {
  id: string;
  title: string;
  status: 'regular' | 'archived';
  createdAt: number;
  updatedAt: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      setThreads([]);
      setLoading(false);
      return;
    }

    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads');
        const data = await response.json();
        setThreads(data.threads || []);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [isSignedIn]);

  return { threads, loading };
}

export function useThreadMessages(threadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !threadId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/threads/${threadId}`);
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isSignedIn, threadId]);

  return { messages, loading };
}