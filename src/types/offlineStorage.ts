type SyncStatus = 'pending' | 'synced' | 'error';

interface OfflineStorageItem {
  id: string | number;
  syncStatus: SyncStatus;
  [key: string]: any;
}

export type { OfflineStorageItem, SyncStatus };

