import { kv } from '@vercel/kv';

export interface StoredThread {
  id: string;
  title: string;
  status: 'regular' | 'archived';
  createdAt: number;
  updatedAt: number;
}

export interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

const THREAD_LIST_KEY = (userId: string) => `threads:${userId}`;
const THREAD_MESSAGES_KEY = (userId: string, threadId: string) => `messages:${userId}:${threadId}`;

export class VercelKVThreadStorage {
  constructor(private userId: string) {}

  async listThreads(): Promise<StoredThread[]> {
    const threads = await kv.get<StoredThread[]>(THREAD_LIST_KEY(this.userId));
    return threads || [];
  }

  async createThread(title: string, id?: string): Promise<StoredThread> {
    const thread: StoredThread = {
      id: id || crypto.randomUUID(),
      title,
      status: 'regular',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const threads = await this.listThreads();
    threads.unshift(thread);
    await kv.set(THREAD_LIST_KEY(this.userId), threads);

    return thread;
  }

  async updateThread(threadId: string, updates: Partial<StoredThread>): Promise<void> {
    const threads = await this.listThreads();
    const threadIndex = threads.findIndex(t => t.id === threadId);
    
    if (threadIndex === -1) return;

    threads[threadIndex] = {
      ...threads[threadIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    await kv.set(THREAD_LIST_KEY(this.userId), threads);
  }

  async deleteThread(threadId: string): Promise<void> {
    const threads = await this.listThreads();
    const filteredThreads = threads.filter(t => t.id !== threadId);
    
    await Promise.all([
      kv.set(THREAD_LIST_KEY(this.userId), filteredThreads),
      kv.del(THREAD_MESSAGES_KEY(this.userId, threadId)),
    ]);
  }

  async getMessages(threadId: string): Promise<StoredMessage[]> {
    const messages = await kv.get<StoredMessage[]>(THREAD_MESSAGES_KEY(this.userId, threadId));
    return messages || [];
  }

  async appendMessage(threadId: string, message: Omit<StoredMessage, 'id' | 'createdAt'>): Promise<void> {
    const messages = await this.getMessages(threadId);
    const newMessage: StoredMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    messages.push(newMessage);
    await kv.set(THREAD_MESSAGES_KEY(this.userId, threadId), messages);

    // Update thread's updatedAt timestamp
    await this.updateThread(threadId, {});
  }

  async clearMessages(threadId: string): Promise<void> {
    await kv.del(THREAD_MESSAGES_KEY(this.userId, threadId));
  }
}