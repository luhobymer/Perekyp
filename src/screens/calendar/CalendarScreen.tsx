import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { CalendarView } from '../../components/CalendarView';
import { EventForm } from '../../components/EventForm';
import Button from '../../components/Button';
import { useCalendar, CalendarEvent as CalendarEventType } from '../../hooks/useCalendar';

/**
 * Екран календаря для відображення та управління подіями
 */
export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { deleteEvent } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventType | null>(null);
  const [showEventForm, setShowEventForm] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /**
   * Обробник натискання на подію
   */
  const handleEventPress = (event: CalendarEventType): void => {
    setSelectedEvent(event);
    setIsEditing(true);
    setShowEventForm(true);
  };

  /**
   * Обробник додавання нової події
   */
  const handleAddEvent = (): void => {
    setSelectedEvent(null);
    setIsEditing(false);
    setShowEventForm(true);
  };

  /**
   * Обробник збереження події
   */
  const handleSaveEvent = (): void => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  /**
   * Обробник видалення події
   */
  const handleDeleteEvent = async (): Promise<void> => {
    if (selectedEvent && 'id' in selectedEvent) {
      await deleteEvent((selectedEvent as any).id);
      setShowEventForm(false);
      setSelectedEvent(null);
      setIsEditing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CalendarView onEventPress={handleEventPress} />
      
      <Button
        title="Додати подію"
        onPress={handleAddEvent}
        style={styles.addButton}
      />

      <Modal
        visible={showEventForm}
        animationType="slide"
        onRequestClose={() => setShowEventForm(false)}
      >
        <EventForm
          event={selectedEvent || undefined}
          onSave={handleSaveEvent}
          onCancel={() => setShowEventForm(false)}
        />
        {isEditing && (
          <Button
            title="Видалити"
            onPress={handleDeleteEvent}
            type="danger"
            style={styles.deleteButton}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
  },
});
