interface ColorPalette {
  colors: string[];
  timestamp: number;
  tags: string[];
}

class ColorCache {
  private static instance: ColorCache;
  private cache: Map<string, ColorPalette> = new Map();
  private readonly TTL = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  public static getInstance(): ColorCache {
    if (!ColorCache.instance) {
      ColorCache.instance = new ColorCache();
    }
    return ColorCache.instance;
  }

  private generateKey(tags: string[]): string {
    return tags.sort().join('|');
  }

  private isExpired(timestamp: number): boolean {
    return Date.now() - timestamp > this.TTL;
  }

  public get(tags: string[]): ColorPalette | null {
    const key = this.generateKey(tags);
    const cached = this.cache.get(key);

    if (!cached || this.isExpired(cached.timestamp)) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  public set(tags: string[], colors: string[]): void {
    const key = this.generateKey(tags);
    this.cache.set(key, {
      colors,
      timestamp: Date.now(),
      tags
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public prune(): void {
    for (const [key, value] of this.cache.entries()) {
      if (this.isExpired(value.timestamp)) {
        this.cache.delete(key);
      }
    }
  }
}

export const colorCache = ColorCache.getInstance(); 