// Оголошення типів для модулів без типів

declare module '@testing-library/react-native' {
  export const render: any;
  export const fireEvent: any;
  export const waitFor: any;
  export const act: any;
  export const cleanup: any;
  export const within: any;
  export default {
    render,
    fireEvent,
    waitFor,
    act,
    cleanup,
    within
  };
}

declare module 'expo-device' {
  export const isDevice: boolean;
  export const brand: string | null;
  export const manufacturer: string | null;
  export const modelName: string | null;
  export const modelId: string | null;
  export const deviceYearClass: number | null;
  export const totalMemory: number | null;
  export const osName: string | null;
  export const osVersion: string | null;
  export const osBuildId: string | null;
  export const osInternalBuildId: string | null;
  export const deviceName: string | null;
  export default {
    isDevice,
    brand,
    manufacturer,
    modelName,
    modelId,
    deviceYearClass,
    totalMemory,
    osName,
    osVersion,
    osBuildId,
    osInternalBuildId,
    deviceName
  };
}

declare module '@react-native-firebase/messaging' {
  export interface FirebaseMessagingTypes {
    requestPermission(): Promise<boolean>;
    getToken(): Promise<string>;
    onMessage(callback: (message: any) => void): () => void;
    onNotificationOpenedApp(callback: (message: any) => void): () => void;
    getInitialNotification(): Promise<any>;
  }

  export default function messaging(): FirebaseMessagingTypes;
}
