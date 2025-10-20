import React from 'react';
import { 
  View, 
  Text, 
  TextInput as RNTextInput, 
  StyleSheet, 
  Platform
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { SIZES, FONTS } from '../constants/theme';
import { responsiveTypography, getResponsiveValue } from '../styles/responsiveStyles';
import { InputProps } from '../types/components';

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  error = null,
  maxLength,
  editable = true,
  style = {},
  containerStyle = {},
  labelStyle = {},
  inputStyle = {},
  errorStyle = {},
  autoCapitalize = 'sentences',
  returnKeyType = 'done',
  onSubmitEditing,
  ...props
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[
          styles.label, 
          { color: colors.text }, 
          labelStyle
        ]}>
          {label}
        </Text>
      ) : null}
      
      <View style={[
        styles.inputContainer,
        { 
          backgroundColor: editable ? colors.card : `${colors.border}30`,
          borderColor: error ? colors.error : colors.border
        },
        style
      ]}>
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${colors.textSecondary}80`}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          style={[
            styles.input,
            { 
              color: colors.text,
              height: multiline ? getResponsiveValue(80, 100, 120) : getResponsiveValue(36, 40, 44),
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle
          ]}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          {...props}
        />
      </View>
      
      {error ? (
        <Text style={[
          styles.errorText, 
          { color: colors.error },
          errorStyle
        ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: getResponsiveValue(SIZES.small, SIZES.medium, SIZES.large),
    width: '100%',
  },
  label: {
    ...responsiveTypography.body2,
    marginBottom: 4,
    fontWeight: FONTS.weights.medium as any,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    ...responsiveTypography.body1,
    paddingVertical: 0, // Важливо для правильного відображення на Android
    textAlign: 'left' as 'left',
    width: '100%',
  },
  errorText: {
    ...responsiveTypography.caption,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
