export default class StorageUtil<T> {
    static Get<T>(key: string, defaultValue: T): T {
      const item = localStorage.getItem(key) || "";
      return item ? (JSON.parse(item) as T) : defaultValue;
    }
  
    static Set<T>(key: string, item: T) {
      localStorage.setItem(key, JSON.stringify(item));
    }
  }
  