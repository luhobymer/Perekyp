import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { CarInfoProps } from '../types/components';
// Імпортуємо тип Car з файлу типів

const CarInfo: React.FC<CarInfoProps> = ({ car }) => {
  const { theme } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не вказано';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: uk });
  };

  const formatPrice = (price?: number): string => {
    if (!price) return 'Не вказано';
    return `${price.toLocaleString()} грн`;
  };

  const getStatusLabel = (status?: string): string => {
    if (!status) return 'Не вказано';
    
    switch (status) {
      case 'active':
        return 'В наявності';
      case 'sold':
        return 'Продано';
      case 'reserved':
        return 'Зарезервовано';
      case 'service':
        return 'На сервісі';
      case 'checking':
        return 'Перевірка';
      case 'purchased':
        return 'Придбано';
      case 'repairing':
        return 'Ремонт';
      default:
        return status;
    }
  };

  const getStatusColor = (status?: string): string => {
    if (!status) return theme.colors.textSecondary;
    
    switch (status) {
      case 'active':
      case 'purchased':
        return theme.colors.success;
      case 'sold':
        return theme.colors.primary;
      case 'reserved':
        return theme.colors.warning;
      case 'service':
      case 'repairing':
        return theme.colors.secondary;
      case 'checking':
        // Використовуємо warning замість info, оскільки info не існує в темі
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.card }]}>
      {car.image_url ? (
        <TouchableOpacity onPress={() => setShowImageModal(true)}>
          <Image
            source={{ uri: car.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <Ionicons name="expand-outline" size={24} color="white" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={[styles.noImage, { backgroundColor: theme.colors.border }]}>
          <Ionicons name="car-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary }}>Фото відсутнє</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {car.year} {car.make} {car.model}
        </Text>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
            Статус:
          </Text>
          <Text style={[styles.statusValue, { color: getStatusColor(car.status) }]}>
            {getStatusLabel(car.status)}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              VIN:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {car.vin || 'Не вказано'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Пробіг:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {car.mileage ? `${car.mileage.toLocaleString()} км` : 'Не вказано'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Ціна придбання:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatPrice(car.purchase_price)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Ціна продажу:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatPrice(car.selling_price)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Витрати:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatPrice(car.total_expenses)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Дата додавання:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatDate(car.created_at)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Останнє оновлення:
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {formatDate(car.updated_at)}
            </Text>
          </View>
        </View>

        {car.notes && (
          <View style={styles.notesContainer}>
            <Text style={[styles.notesLabel, { color: theme.colors.textSecondary }]}>
              Примітки:
            </Text>
            <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
              <Text
                style={[styles.notesText, { color: theme.colors.text }]}
                numberOfLines={showFullDescription ? undefined : 3}
              >
                {car.notes}
              </Text>
              {car.notes.length > 120 && (
                <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
                  {showFullDescription ? 'Згорнути' : 'Показати більше'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showImageModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close-circle" size={36} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: car.image_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  showMoreText: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});

export default CarInfo;
