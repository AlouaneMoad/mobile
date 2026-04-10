import { openDB } from 'idb';

const DB_NAME = 'WeightManagementDB';
const DB_VERSION = 1;

const STORES = {
  USERS: 'users',
  WEIGHT_RECORDS: 'weightRecords',
  DIET_PLANS: 'dietPlans',
  EXERCISE_SUGGESTIONS: 'exerciseSuggestions'
};

// Initialize database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const userStore = db.createObjectStore(STORES.USERS, { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('username', 'username', { unique: true });
        userStore.createIndex('email', 'email', { unique: true });
      }

      // Weight records store
      if (!db.objectStoreNames.contains(STORES.WEIGHT_RECORDS)) {
        const weightStore = db.createObjectStore(STORES.WEIGHT_RECORDS, { keyPath: 'id', autoIncrement: true });
        weightStore.createIndex('userId', 'userId');
        weightStore.createIndex('date', 'date');
      }

      // Diet plans store
      if (!db.objectStoreNames.contains(STORES.DIET_PLANS)) {
        db.createObjectStore(STORES.DIET_PLANS, { keyPath: 'id', autoIncrement: true });
      }

      // Exercise suggestions store
      if (!db.objectStoreNames.contains(STORES.EXERCISE_SUGGESTIONS)) {
        db.createObjectStore(STORES.EXERCISE_SUGGESTIONS, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

// Generic CRUD operations
const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION);
};

// User operations
export const userOperations = {
  async create(user) {
    const db = await getDB();
    return db.add(STORES.USERS, user);
  },

  async getByUsername(username) {
    const db = await getDB();
    return db.getFromIndex(STORES.USERS, 'username', username);
  },

  async getByEmail(email) {
    const db = await getDB();
    return db.getFromIndex(STORES.USERS, 'email', email);
  },

  async getAll() {
    const db = await getDB();
    return db.getAll(STORES.USERS);
  },

  async login(username, password) {
    const db = await getDB();
    const user = await db.getFromIndex(STORES.USERS, 'username', username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
};

// Weight record operations
export const weightOperations = {
  async create(record) {
    const db = await getDB();
    const tx = db.transaction(STORES.WEIGHT_RECORDS, 'readwrite');
    const store = tx.objectStore(STORES.WEIGHT_RECORDS);

    const recordWithTimestamp = {
      ...record,
      createdAt: new Date().toISOString(),
      synced: true
    };

    const id = await store.add(recordWithTimestamp);
    await tx.done;
    return id;
  },

  async getByUserId(userId) {
    const db = await getDB();
    const records = await db.getAllFromIndex(STORES.WEIGHT_RECORDS, 'userId', userId);
    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getAll() {
    const db = await getDB();
    const records = await db.getAll(STORES.WEIGHT_RECORDS);
    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async update(id, record) {
    const db = await getDB();
    const tx = db.transaction(STORES.WEIGHT_RECORDS, 'readwrite');
    const store = tx.objectStore(STORES.WEIGHT_RECORDS);

    const existing = await store.get(id);
    if (existing) {
      const updated = { ...existing, ...record, updatedAt: new Date().toISOString() };
      await store.put(updated);
      await tx.done;
      return updated;
    }
    throw new Error('Record not found');
  },

  async delete(id) {
    const db = await getDB();
    return db.delete(STORES.WEIGHT_RECORDS, id);
  },

  async getRecent(userId, days = 30) {
    const records = await this.getByUserId(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return records.filter(record => new Date(record.date) >= cutoffDate);
  }
};

// Diet plan operations
export const dietOperations = {
  async create(plan) {
    const db = await getDB();
    return db.add(STORES.DIET_PLANS, { ...plan, createdAt: new Date().toISOString() });
  },

  async getAll() {
    const db = await getDB();
    return db.getAll(STORES.DIET_PLANS);
  },

  async delete(id) {
    const db = await getDB();
    return db.delete(STORES.DIET_PLANS, id);
  }
};

// Exercise operations
export const exerciseOperations = {
  async create(suggestion) {
    const db = await getDB();
    return db.add(STORES.EXERCISE_SUGGESTIONS, {
      ...suggestion,
      createdAt: new Date().toISOString()
    });
  },

  async getAll() {
    const db = await getDB();
    return db.getAll(STORES.EXERCISE_SUGGESTIONS);
  },

  async delete(id) {
    const db = await getDB();
    return db.delete(STORES.EXERCISE_SUGGESTIONS, id);
  }
};

// Check if offline storage is available
export const isOfflineStorageAvailable = () => {
  return 'indexedDB' in window;
};

export { STORES };
