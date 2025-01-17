import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ChatMessage {
  id: string;
  itemId: string;
  user: string;
  message: string;
  timestamp: number;
  isToolResponse?: boolean;
  status?: 'success' | 'error';
  data?: any;
}

interface ChatDB extends DBSchema {
  messages: {
    key: string;
    value: ChatMessage;
    indexes: {
      'by-item': string;
      'by-timestamp': number;
    };
  };
}

class ChatStorage {
  private db: Promise<IDBPDatabase<ChatDB>>;

  constructor() {
    if (typeof window === 'undefined') {
      // Server-side fallback
      this.db = Promise.reject('IndexedDB not available on server');
      return;
    }

    this.db = openDB<ChatDB>('chat-store', 1, {
      upgrade(db) {
        const store = db.createObjectStore('messages', {
          keyPath: 'id'
        });
        store.createIndex('by-item', 'itemId');
        store.createIndex('by-timestamp', 'timestamp');
      }
    });
  }

  async getMessages(itemId: string): Promise<ChatMessage[]> {
    if (typeof window === 'undefined') return [];
    const db = await this.db;
    const messages = await db.getAllFromIndex('messages', 'by-item', itemId);
    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }

  async addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const db = await this.db;
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    await db.add('messages', newMessage);
    return newMessage;
  }

  async clearMessages(itemId: string): Promise<void> {
    const db = await this.db;
    const store = db.transaction('messages', 'readwrite').store;
    const messages = await store.index('by-item').getAllKeys(itemId);
    await Promise.all(messages.map(key => store.delete(key)));
  }

  async updateMessage(id: string, updates: Partial<ChatMessage>): Promise<void> {
    const db = await this.db;
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    const message = await store.get(id);
    if (message) {
      await store.put({ ...message, ...updates });
    }
  }
}

export const chatStorage = new ChatStorage(); 