import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

interface CachedImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: any) => void;
  size?: string | number;
  children?: React.ReactNode;
}

/**
 * Компонент для кешованого зображення з підтримкою заглушок та обробки помилок
 */
const CachedImage: React.FC<CachedImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  placeholder,
  onLoad,
  onError,
  size,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(error);
  };

  // Відображаємо заглушку, якщо зображення завантажується або сталася помилка
  if (isLoading && placeholder) {
    return <>{placeholder}</>;
  }

  // Відображаємо заглушку за замовчуванням у разі помилки
  if (hasError) {
    return (
      <Image
        source={require('../assets/images/image-placeholder.png')}
        style={style}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default CachedImage;
