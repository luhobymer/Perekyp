import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState, NetInfoSubscription, NetInfoStateType } from '@react-native-community/netinfo';

// Типи для мережі
export interface NetworkHook {
  isConnected: boolean;
  connectionType: NetInfoStateType | null;
  loading: boolean;
  error: string | null;
  checkConnection: () => Promise<void>;
  isWifi: boolean;
  isCellular: boolean;
  isEthernet: boolean;
  isOffline: boolean;
}

export const useNetwork = (): NetworkHook => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<NetInfoStateType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const state = await NetInfo.fetch();
      setIsConnected(!!state.isConnected);
      setConnectionType(state.type);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка перевірки з\'єднання:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    const unsubscribe: NetInfoSubscription = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(!!state.isConnected);
      setConnectionType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, [checkConnection]);

  const isWifi = connectionType === 'wifi';
  const isCellular = connectionType === 'cellular';
  const isEthernet = connectionType === 'ethernet';
  const isOffline = !isConnected;

  return {
    isConnected,
    connectionType,
    loading,
    error,
    checkConnection,
    isWifi,
    isCellular,
    isEthernet,
    isOffline,
  };
};

export default useNetwork;
