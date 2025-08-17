// Queue implementation for Recent Views
export class Queue<T> {
  private items: T[] = [];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  enqueue(item: T): void {
    if (this.items.length >= this.maxSize) {
      this.items.shift(); // Remove oldest item
    }
    // Remove if already exists to avoid duplicates
    const index = this.items.findIndex(existing => 
      typeof item === 'object' && typeof existing === 'object' && item !== null && existing !== null
        ? (item as any).id === (existing as any).id
        : item === existing
    );
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items].reverse(); // Most recent first
  }

  clear(): void {
    this.items = [];
  }
}

// Set implementation for Favorites
export class FavoriteSet<T> {
  private items: Set<string> = new Set();

  add(item: T): void {
    const key = typeof item === 'object' && item !== null ? (item as any).id : String(item);
    this.items.add(String(key));
  }

  remove(item: T): void {
    const key = typeof item === 'object' && item !== null ? (item as any).id : String(item);
    this.items.delete(String(key));
  }

  has(item: T): boolean {
    const key = typeof item === 'object' && item !== null ? (item as any).id : String(item);
    return this.items.has(String(key));
  }

  size(): number {
    return this.items.size;
  }

  toArray(): string[] {
    return Array.from(this.items);
  }

  clear(): void {
    this.items.clear();
  }
}

// HashMap for efficient tag-based search
export class SearchHashMap {
  private tagIndex: Map<string, Set<number>> = new Map();
  private regionIndex: Map<string, Set<number>> = new Map();
  private typeIndex: Map<string, Set<number>> = new Map();
  private ingredientIndex: Map<string, Set<number>> = new Map();

  buildIndex(recipes: any[]): void {
    recipes.forEach(recipe => {
      // Index tags
      recipe.tags?.forEach((tag: string) => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(recipe.id);
      });

      // Index region
      if (recipe.region) {
        if (!this.regionIndex.has(recipe.region)) {
          this.regionIndex.set(recipe.region, new Set());
        }
        this.regionIndex.get(recipe.region)!.add(recipe.id);
      }

      // Index type
      if (recipe.type) {
        if (!this.typeIndex.has(recipe.type)) {
          this.typeIndex.set(recipe.type, new Set());
        }
        this.typeIndex.get(recipe.type)!.add(recipe.id);
      }

      // Index ingredients
      recipe.ingredients?.forEach((ingredient: string) => {
        const words = ingredient.toLowerCase().split(' ');
        words.forEach(word => {
          if (word.length > 2) { // Skip short words
            if (!this.ingredientIndex.has(word)) {
              this.ingredientIndex.set(word, new Set());
            }
            this.ingredientIndex.get(word)!.add(recipe.id);
          }
        });
      });
    });
  }

  searchByTag(tag: string): Set<number> {
    return this.tagIndex.get(tag.toLowerCase()) || new Set();
  }

  searchByRegion(region: string): Set<number> {
    return this.regionIndex.get(region) || new Set();
  }

  searchByType(type: string): Set<number> {
    return this.typeIndex.get(type) || new Set();
  }

  searchByIngredient(ingredient: string): Set<number> {
    return this.ingredientIndex.get(ingredient.toLowerCase()) || new Set();
  }

  getIntersection(sets: Set<number>[]): Set<number> {
    if (sets.length === 0) return new Set();
    let result = new Set(sets[0]);
    for (let i = 1; i < sets.length; i++) {
      result = new Set([...result].filter(x => sets[i].has(x)));
    }
    return result;
  }
}