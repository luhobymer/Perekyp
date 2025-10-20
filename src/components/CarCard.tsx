import React, { useEffect } from 'react';
import { 
  ImageSourcePropType, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ViewStyle, 
  StyleProp, 
  Animated
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { SIZES, SHADOWS } from '../constants/theme';
import { useAnimation } from '../hooks/useAnimation';
import { cardAnimation } from '../animations/componentAnimations';
import CachedImage from './CachedImage';
import { CarCardProps } from '../types/components/carCard';

// Додаткові типи для стилів видалено, оскільки вони не використовуються

/**
 * Картка автомобіля для відображення в списку
 */
const CarCard: React.FC<CarCardProps> = ({ 
  car, 
  onPress, 
  onDelete, 
  index = 0 
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const { animation, start } = useAnimation('default', {
    duration: 300,
    delay: index * 100,
  });

  useEffect(() => {
    start();
  }, [start]);

  // Функція для визначення кольору статусу
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checking':
        return theme.colors.warning;
      case 'purchased':
        return theme.colors.primary; // Використовуємо primary замість info
      case 'repairing':
        return theme.colors.secondary; // Використовуємо secondary замість accent
      case 'sold':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Переклад статусу
  const getStatusText = (status: string) => {
    switch (status) {
      case 'checking':
        return t('status_checking');
      case 'purchased':
        return t('status_purchased');
      case 'repairing':
        return t('status_repairing');
      case 'sold':
        return t('status_sold');
      default:
        return status;
    }
  };

  // Вибір зображення (заглушка або фото автомобіля)
  const getCarImage = (): ImageSourcePropType => {
    if (car.image_url) {
      return { uri: car.image_url };
    } else {
      // Використовуємо вбудоване зображення як заглушку
      return { uri: 'https://www.pngkey.com/png/full/115-1150152_car-placeholder-car-icon-png.png' };
    }
  };

  const formatCurrency = (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const totalExpenses = car.total_expenses || 0;
  const potentialProfit = (car.selling_price || 0) - (car.purchase_price || 0) - totalExpenses;

  // Отримуємо стилі з використанням кольорів теми
  const styles = StyleSheet.create({
    container: {
      borderRadius: SIZES.cardRadius,
      marginBottom: SIZES.medium,
      overflow: 'hidden',
      elevation: 3,
    },
    touchable: {
      width: '100%',
      height: '100%',
    },
    content: {
      flexDirection: 'row',
      padding: SIZES.medium,
    },
    imageContainer: {
      width: 120,
      height: 90,
      borderRadius: SIZES.small,
      overflow: 'hidden',
      marginRight: SIZES.medium,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    statusBadge: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 2,
      alignItems: 'center',
      backgroundColor: '#4CAF50',
    },
    statusText: {
      color: 'white',
      fontSize: 10,
      fontWeight: 'bold',
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    title: {
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.text,
      fontSize: 16,
    },
    detailsRow: {
      marginTop: SIZES.small,
    },
    detailItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 12,
      marginRight: 4,
      color: theme.colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    notesContainer: {
      marginTop: SIZES.small,
      paddingTop: SIZES.small,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
    },
    notesText: {
      fontSize: 12,
      fontStyle: 'italic',
      color: theme.colors.textSecondary,
    },
    deleteButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButtonText: {
      color: 'white',
      fontSize: 18,
      lineHeight: 20,
      fontWeight: 'bold',
    },
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.card,
          ...SHADOWS.medium 
        },
        cardAnimation(animation)
      ]}
    >
      <TouchableOpacity
        style={styles.touchable as StyleProp<ViewStyle>}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${car.make} ${car.model} ${car.year}`}
      >
        <View style={styles.content}>
          {/* Зображення автомобіля */}
          <View style={styles.imageContainer}>
            <CachedImage
              source={getCarImage()}
              style={styles.image}
              resizeMode="cover"
              placeholder={require('../assets/placeholder.png')}
              onLoad={() => {}}
              onError={() => {}}
            />
            
            {/* Статусний баджет */}
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(car.status) }
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(car.status).toUpperCase()}
              </Text>
            </View>
          </View>
          
          {/* Інформація про автомобіль */}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {car.year} {car.make} {car.model}
            </Text>
            
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('price')}:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(car.purchase_price || 0)}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('mileage')}:</Text>
                <Text style={styles.detailValue}>
                  {car.mileage?.toLocaleString()} {t('km')}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('vin')}:</Text>
                <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
                  {car.vin || t('not_specified')}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('expenses')}:</Text>
                <Text style={[styles.detailValue, { color: totalExpenses > 0 ? theme.colors.error : theme.colors.text }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('profit')}:</Text>
                <Text 
                  style={[styles.detailValue, { 
                    color: potentialProfit > 0 ? theme.colors.success : theme.colors.error,
                    fontWeight: 'bold' as any
                  }]}
                >
                  {formatCurrency(potentialProfit)}
                </Text>
              </View>
            </View>
            
            {car.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesText} numberOfLines={2}>
                  {car.notes}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Кнопка видалення (якщо передана) */}
      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          accessibilityLabel={t('delete_car')}
          accessibilityRole="button"
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

export default CarCard;
