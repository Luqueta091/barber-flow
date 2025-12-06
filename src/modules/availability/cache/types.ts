export type CacheKeyInput = {
  unitId: string;
  serviceId: string;
  date: string; // ISO date (YYYY-MM-DD)
};

export type SlotDTO = {
  start: string;
  end: string;
};

export type CachedAvailability = {
  slots: SlotDTO[];
  generatedAt: string;
};

export interface AvailabilityCache {
  get(key: CacheKeyInput): Promise<CachedAvailability | null>;
  set(key: CacheKeyInput, value: CachedAvailability): Promise<void>;
  invalidate(key: CacheKeyInput): Promise<void>;
  invalidateUnit(unitId: string): Promise<void>;
}
