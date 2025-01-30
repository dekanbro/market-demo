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

// Memory fallback for server-side
const memoryStore: { [key: string]: ChatMessage[] } = {};

class ChatStorage {
  private db: Promise<IDBPDatabase<ChatDB>> | null = null;
  private isServer: boolean;

  constructor() {
    this.isServer = typeof window === 'undefined';
    
    if (!this.isServer) {
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
  }

  async getMessages(itemId: string): Promise<ChatMessage[]> {
    if (this.isServer) {
      return memoryStore[itemId] || [];
    }

    try {
      const db = await this.db;
      if (!db) return [];
      
      const messages = await db.getAllFromIndex('messages', 'by-item', itemId);
      return messages.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  async addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    if (this.isServer) {
      if (!memoryStore[message.itemId]) {
        memoryStore[message.itemId] = [];
      }
      memoryStore[message.itemId].push(newMessage);
      return newMessage;
    }

    try {
      const db = await this.db;
      if (!db) throw new Error('Database not initialized');
      
      await db.add('messages', newMessage);
      return newMessage;
    } catch (error) {
      console.error('Failed to add message:', error);
      throw error;
    }
  }

  async clearMessages(itemId: string): Promise<void> {
    if (this.isServer) {
      delete memoryStore[itemId];
      return;
    }

    try {
      const db = await this.db;
      if (!db) return;
      
      const store = db.transaction('messages', 'readwrite').store;
      const messages = await store.index('by-item').getAllKeys(itemId);
      await Promise.all(messages.map(key => store.delete(key)));
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  }

  async updateMessage(id: string, updates: Partial<ChatMessage>): Promise<void> {
    if (this.isServer) {
      Object.values(memoryStore).forEach(messages => {
        const message = messages.find(m => m.id === id);
        if (message) {
          Object.assign(message, updates);
        }
      });
      return;
    }

    try {
      const db = await this.db;
      if (!db) return;
      
      const tx = db.transaction('messages', 'readwrite');
      const store = tx.objectStore('messages');
      const message = await store.get(id);
      if (message) {
        await store.put({ ...message, ...updates });
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  }
}

export const chatStorage = new ChatStorage(); 