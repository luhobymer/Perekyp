import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { t } from '../utils/i18n';

// Типи для галереї
export interface ImageResult {
  uri: string;
  width?: number;
  height?: number;
  cancelled: boolean;
}

export interface ImagePickerOptions {
  mediaTypes?: ImagePicker.MediaTypeOptions;
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  allowsMultipleSelection?: boolean;
  exif?: boolean;
}

export interface GalleryHook {
  pickImage: (options?: ImagePickerOptions) => Promise<ImageResult>;
  takePhoto: (options?: ImagePickerOptions) => Promise<ImageResult>;
  isWeb: boolean;
  showWebLimitationMessage: () => void;
}

const useGallery = (): GalleryHook => {
  // Check if platform is web
  const isWeb = Platform.OS === 'web';

  // Показати повідомлення про обмеження веб-версії
  const showWebLimitationMessage = (): void => {
    if (isWeb) {
      Alert.alert(
        t('web_version_limitation', 'Обмеження веб-версії'),
        t('image_picker_web_limitation', 'У веб-версії додатка доступні обмежені функції вибору зображень')
      );
    }
  };

  const webPickImage = async (): Promise<ImageResult> => {
    // Показуємо повідомлення про обмеження перед вибором зображення
    showWebLimitationMessage();
    
    return new Promise<ImageResult>((resolve, reject) => {
      if (!window.File || !window.FileReader) {
        reject(new Error(t('browser_not_supported', 'Ваш браузер не підтримує необхідні функції для роботи з файлами')));
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      
      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
          reject(new Error(t('image_pick_cancelled', 'Вибір скасовано')));
          return;
        }

        // Перевіряємо розмір файлу (максимум 5МБ)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(t('image_too_large', 'Зображення занадто велике')));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          resolve({
            uri: e.target?.result as string,
            width: 500, // Default values since web doesn't provide these easily
            height: 500,
            cancelled: false,
          });
        };
        
        reader.onerror = () => {
          reject(new Error(t('image_read_error', 'Помилка читання файлу')));
        };
        
        reader.readAsDataURL(file);
      };
      
      document.body.appendChild(input);
      input.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(input);
      }, 100);
    });
  };

  const getPermissionAsync = async (): Promise<boolean> => {
    if (isWeb) return true; // Web doesn't need explicit permissions

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return false;
    }
    return true;
  };

  const pickImage = async (options: ImagePickerOptions = {}): Promise<ImageResult> => {
    if (isWeb) {
      try {
        return await webPickImage();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
        Alert.alert(errorMessage);
        return { uri: '', cancelled: true };
      }
    }

    const hasPermission = await getPermissionAsync();
    if (!hasPermission) return { uri: '', cancelled: true };

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      ...options,
    });

    if (result.canceled) {
      return { uri: '', cancelled: true };
    }

    // Resize image to reduce storage size if not on web
    if (!isWeb) {
      try {
        const manipResult = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.8, format: SaveFormat.JPEG }
        );

        return {
          uri: manipResult.uri,
          width: manipResult.width,
          height: manipResult.height,
          cancelled: false,
        };
      } catch (error) {
        console.error('Error manipulating image:', error);
        // Якщо маніпуляція не вдалася, повертаємо оригінальне зображення
        return {
          uri: result.assets[0].uri,
          width: result.assets[0].width,
          height: result.assets[0].height,
          cancelled: false,
        };
      }
    }

    // Повертаємо оригінальне зображення, якщо веб або помилка
    return {
      uri: result.assets[0].uri,
      width: result.assets[0].width,
      height: result.assets[0].height,
      cancelled: false,
    };
  };

  const takePhoto = async (options: ImagePickerOptions = {}): Promise<ImageResult> => {
    if (isWeb) {
      Alert.alert(
        t('web_version_limitation', 'Обмеження веб-версії'),
        t('camera_not_available_web', 'Камера недоступна у веб-версії додатка')
      );
      return { uri: '', cancelled: true };
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      return { uri: '', cancelled: true };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      ...options,
    });

    if (result.canceled) {
      return { uri: '', cancelled: true };
    }

    // Resize image to reduce storage size
    try {
      const manipResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      return {
        uri: manipResult.uri,
        width: manipResult.width,
        height: manipResult.height,
        cancelled: false,
      };
    } catch (error) {
      console.error('Error manipulating camera image:', error);
      // Якщо маніпуляція не вдалася, повертаємо оригінальне зображення
      return {
        uri: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
        cancelled: false,
      };
    }
  };

  return {
    pickImage,
    takePhoto,
    isWeb,
    showWebLimitationMessage,
  };
};

export default useGallery;
