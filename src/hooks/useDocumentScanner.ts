import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Типи для сканера документів
export interface ScannedImage {
  uri: string;
  width: number;
  height: number;
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentScannerHook {
  isScanning: boolean;
  error: string | null;
  scanDocument: () => Promise<ScannedImage | null>;
  enhanceDocument: (imageUri: string) => Promise<ScannedImage | null>;
  cropDocument: (imageUri: string, cropData: CropData) => Promise<ScannedImage | null>;
  rotateDocument: (imageUri: string, angle: number) => Promise<ScannedImage | null>;
}

export const useDocumentScanner = (): DocumentScannerHook => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Дозвіл на використання камери не надано');
      }
      return true;
    } catch (error) {
      setError('Помилка отримання дозволу на використання камери');
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const scanDocument = async (): Promise<ScannedImage | null> => {
    try {
      setIsScanning(true);
      setError(null);

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        return null;
      }

      // Обробка зображення для покращення якості скану
      const processedImage = await manipulateAsync(
        result.assets[0].uri,
        [
          { resize: { width: 2000 } },
          { contrast: 1.2 },
          { brightness: 1.1 },
        ],
        { format: SaveFormat.JPEG, compress: 0.8 }
      );

      return {
        uri: processedImage.uri,
        width: processedImage.width,
        height: processedImage.height,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка сканування документа');
      console.error('Error scanning document:', error);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const enhanceDocument = async (imageUri: string): Promise<ScannedImage | null> => {
    try {
      setIsScanning(true);
      setError(null);

      const enhancedImage = await manipulateAsync(
        imageUri,
        [
          { resize: { width: 2000 } },
          { contrast: 1.2 },
          { brightness: 1.1 },
          { sharpen: 0.5 },
        ],
        { format: SaveFormat.JPEG, compress: 0.8 }
      );

      return {
        uri: enhancedImage.uri,
        width: enhancedImage.width,
        height: enhancedImage.height,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка покращення документа');
      console.error('Error enhancing document:', error);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const cropDocument = async (imageUri: string, cropData: CropData): Promise<ScannedImage | null> => {
    try {
      setIsScanning(true);
      setError(null);

      const croppedImage = await manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropData.x,
              originY: cropData.y,
              width: cropData.width,
              height: cropData.height,
            },
          },
        ],
        { format: SaveFormat.JPEG, compress: 0.8 }
      );

      return {
        uri: croppedImage.uri,
        width: croppedImage.width,
        height: croppedImage.height,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка обрізки документа');
      console.error('Error cropping document:', error);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  const rotateDocument = async (imageUri: string, angle: number): Promise<ScannedImage | null> => {
    try {
      setIsScanning(true);
      setError(null);

      const rotatedImage = await manipulateAsync(
        imageUri,
        [{ rotate: angle }],
        { format: SaveFormat.JPEG, compress: 0.8 }
      );

      return {
        uri: rotatedImage.uri,
        width: rotatedImage.width,
        height: rotatedImage.height,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      setError('Помилка обертання документа');
      console.error('Error rotating document:', error);
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    error,
    scanDocument,
    enhanceDocument,
    cropDocument,
    rotateDocument,
  };
}; 

export default useDocumentScanner;
