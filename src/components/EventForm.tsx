import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useCalendar } from '../hooks/useCalendar';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { EventFormProps } from '../types/components';
import { CalendarEvent, UpdateCalendarEvent } from '../hooks/useCalendar';

export const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const { theme } = useTheme();
  const { createEvent, updateEvent, error, isLoading, calendars } = useCalendar();

  const [title, setTitle] = useState<string>(event?.title || '');
  const [location, setLocation] = useState<string>(event?.location || '');
  const [notes, setNotes] = useState<string>(event?.notes || '');
  const [startDate, setStartDate] = useState<Date>(
    event?.startDate ? new Date(event.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    event?.endDate ? new Date(event.endDate) : new Date()
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    // Переконуємося, що calendarId існує
    const calendarId = event?.calendarId || (calendars.length > 0 ? calendars[0].id : '');
    
    const eventData: CalendarEvent = {
      title,
      location,
      notes,
      startDate,
      endDate,
      calendarId
    };

    let result;
    if (event?.id) {
      const updateData: UpdateCalendarEvent = {
        ...eventData,
        eventId: event.id
      };
      result = await updateEvent(updateData);
    } else {
      result = await createEvent(eventData);
    }

    if (result) {
      onSave();
    }
  };

  const handleStartDateChange = (_: any, selectedDate?: Date): void => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (_: any, selectedDate?: Date): void => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Назва події
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Введіть назву події"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Місце
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Введіть місце проведення"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Початок
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={{ color: theme.colors.text }}>
                {format(startDate, 'dd MMMM yyyy HH:mm', { locale: uk })}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="datetime"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Кінець
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={{ color: theme.colors.text }}>
                {format(endDate, 'dd MMMM yyyy HH:mm', { locale: uk })}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="datetime"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={startDate}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Примітки
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Введіть примітки"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Скасувати"
              onPress={onCancel}
              type="outline"
              style={styles.button}
            />
            <Button
              title="Зберегти"
              onPress={handleSave}
              loading={isLoading}
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
