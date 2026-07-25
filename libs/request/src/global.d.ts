declare module "cloudflare:workers" {
  const env: {
    daisy: {
      get(key: string, type: "text"): Promise<string | null>;
      get<T>(key: string, type: "json"): Promise<T | null>;
      put(key: string, value: string): Promise<void>;
      delete(key: string): Promise<void>;
    };
  };
}
