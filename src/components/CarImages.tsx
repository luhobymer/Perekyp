import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { useImages } from '../hooks/useImages';
import Button from './Button';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import { formatDate } from '../utils/formatters';
import { CarImagesProps, AddImageData } from '../types/components/carImages';
import { CarImage } from '../types/screens/carImages';

/**
 * Компонент для відображення та управління зображеннями автомобіля
 */
const CarImages: React.FC<CarImagesProps> = ({ carId }) => {
  const { theme } = useTheme();
  const [isAddingImage, setIsAddingImage] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<CarImage | null>(null);

  const {
    data: offlineImages,
    isLoading: isOfflineLoading,
    error: offlineError,
    addItem: addOfflineImage,
    updateItem: updateOfflineImage,
    deleteItem: deleteOfflineImage
  } = useOfflineStorage('images');

  const {
    getImages,
    addImage,
    updateImage,
    deleteImage,
    isLoading: isOnlineLoading,
    error: onlineError
  } = useImages();

  const [images, setImages] = useState<CarImage[]>([]);

  useEffect(() => {
    loadImages();
  }, [carId]);

  /**
   * Завантаження зображень для автомобіля
   */
  const loadImages = async (): Promise<void> => {
    try {
      const imagesData = await getImages(carId);
      setImages(imagesData);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  /**
   * Обробник додавання зображення
   */
  const handleAddImage = async (imageData: AddImageData): Promise<void> => {
    try {
      // Додаємо онлайн
      const newImage = await addImage(carId, imageData);
      // Додаємо офлайн
      await addOfflineImage(newImage);
      // Оновлюємо локальний стан
      setImages(prev => [...prev, newImage]);
      setIsAddingImage(false);
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  /**
   * Обробник оновлення зображення
   */
  const handleUpdateImage = async (imageId: string | number, updates: Partial<CarImage>): Promise<void> => {
    try {
      // Оновлюємо онлайн
      const updatedImage = await updateImage(imageId, updates);
      // Оновлюємо офлайн
      await updateOfflineImage(imageId, updates);
      // Оновлюємо локальний стан
      setImages(prev => prev.map(image => 
        image.id === imageId ? updatedImage : image
      ));
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  /**
   * Обробник видалення зображення
   */
  const handleDeleteImage = async (imageId: string | number): Promise<void> => {
    try {
      // Видаляємо онлайн
      await deleteImage(imageId);
      // Видаляємо офлайн
      await deleteOfflineImage(imageId);
      // Оновлюємо локальний стан
      setImages(prev => prev.filter(image => image.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  /**
   * Рендер елемента зображення
   */
  const renderImageItem = ({ item }: { item: CarImage }): JSX.Element => (
    <TouchableOpacity 
      style={[styles.imageItem, { backgroundColor: theme.colors.card }]}
      onPress={() => setSelectedImage(item)}
    >
      <Image 
        source={{ uri: item.url }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.imageInfo}>
        <Text style={[styles.imageDate, { color: theme.colors.textSecondary }]}>
          {item.date ? formatDate(item.date) : ''}
        </Text>
        
        <TouchableOpacity 
          onPress={() => handleDeleteImage(item.id)}
          style={styles.deleteButton}
        >
          <Text style={[styles.deleteButtonText, { color: theme.colors.error }]}>
            Видалити
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isOfflineLoading || isOnlineLoading) {
    return <LoadingIndicator />;
  }

  if (offlineError || onlineError) {
    return <ErrorMessage message={(offlineError || onlineError || 'Помилка завантаження зображень').toString()} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Зображення
        </Text>
      </View>

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      <Button
        title="Додати зображення"
        onPress={() => setIsAddingImage(true)}
        type="primary"
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 16,
  },
  imageItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  imageInfo: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 16,
  },
});

export default CarImages;
