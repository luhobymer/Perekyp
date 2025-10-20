import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { SIZES, FONTS } from '../../constants/theme';
// @ts-ignore - Ігноруємо помилку відсутності типів
import { Ionicons } from '@expo/vector-icons';
import { CarImage, CarImagesScreenProps } from '../../types/screens/carImages';

const { width } = Dimensions.get('window');
const imageSize = width / 2 - SIZES.large * 1.5;

/**
 * Екран для перегляду та управління зображеннями автомобіля
 */
const CarImagesScreen: React.FC<CarImagesScreenProps> = ({ route }) => {
  const { carId, images: initialImages } = route.params;
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<CarImage[]>([]);

  // Отримання даних
  useEffect(() => {
    // У реальному додатку тут буде запит до API
    setTimeout(() => {
      // Якщо передали початкові зображення, використовуємо їх
      if (initialImages && initialImages.length > 0) {
        setImages(initialImages.map((url: string, index: number) => ({ id: index + 1, url })));
      } else {
        // Інакше використовуємо тестові дані
        setImages([
          { id: 1, url: 'https://cdn.pixabay.com/photo/2016/04/17/22/10/bmw-1335674_1280.png', date: '2023-05-10' },
          { id: 2, url: 'https://cdn.pixabay.com/photo/2019/07/07/14/03/fiat-4322521_1280.jpg', date: '2023-05-10' },
          { id: 3, url: 'https://cdn.pixabay.com/photo/2015/01/23/15/05/dashboard-609449_1280.jpg', date: '2023-05-11' },
          { id: 4, url: 'https://cdn.pixabay.com/photo/2017/01/28/21/48/auto-2016504_1280.jpg', date: '2023-05-11' },
        ]);
      }
      setLoading(false);
    }, 800);
  }, [carId, initialImages]);

  /**
   * Рендер елемента зображення
   */
  const renderImageItem = ({ item }: { item: CarImage }): JSX.Element => (
    <TouchableOpacity 
      style={[styles.imageContainer, { backgroundColor: theme.colors.card }]}
      onPress={() => {
        // Відкриття повноекранного перегляду зображення
        Alert.alert(t('image_viewer_coming_soon'));
      }}
    >
      <Image source={{ uri: item.url }} style={styles.image} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderImageItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {t('car_images')}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                {t('total_images')}: {images.length}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            {t('no_images_yet')}
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
            {t('add_images_by_tapping')}
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Тут буде відкриватися галерея для вибору зображення
          Alert.alert(t('add_image_coming_soon'));
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: SIZES.medium,
    paddingHorizontal: SIZES.medium,
  },
  title: {
    fontSize: FONTS.sizes.large,
    fontWeight: 'bold',
    marginBottom: SIZES.xsmall,
  },
  subtitle: {
    fontSize: FONTS.sizes.medium,
  },
  listContent: {
    padding: SIZES.medium,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    margin: SIZES.small,
    borderRadius: SIZES.small,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.large,
  },
  emptyText: {
    fontSize: FONTS.sizes.large,
    fontWeight: '600',
    marginTop: SIZES.medium,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: FONTS.sizes.medium,
    marginTop: SIZES.small,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: SIZES.large,
    right: SIZES.large,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default CarImagesScreen;
