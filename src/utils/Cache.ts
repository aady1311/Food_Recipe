import { CacheEntry } from '../types/Recipe';

// LRU Cache implementation for MPCA concepts
export class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number; // Time to live in milliseconds

  constructor(capacity: number = 50, ttlMinutes: number = 30) {
    this.capacity = capacity;
    this.defaultTTL = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      expiry
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Memory optimization - clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics for monitoring
  getStats(): { size: number, capacity: number, hitRate: number } {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: 0 // Could be implemented with hit/miss counters
    };
  }
}

// Singleton cache instance
export const recipeCache = new LRUCache(100, 15); // 100 items, 15 minutes TTL