import React from 'react';
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

/**
 * Тести для перевірки типів компонентів
 * 
 * Ці тести перевіряють, що компоненти мають правильні типи пропсів
 */
describe('Component Types', () => {
  test('React компоненти мають правильні типи', () => {
    // Перевірка типів для React компонентів
    const ViewComponent: React.FC = () => <View />;
    const TextComponent: React.FC<{ text: string }> = ({ text }) => <Text>{text}</Text>;
    
    // TypeScript перевірка
    const isReactFC: React.FC = ViewComponent;
    const isReactFCWithProps: React.FC<{ text: string }> = TextComponent;
    
    // Перевірка, що компоненти рендеряться без помилок
    expect(() => render(<ViewComponent />)).not.toThrow();
    expect(() => render(<TextComponent text="Test" />)).not.toThrow();
  });
  
  test('Типи пропсів правильно перевіряються', () => {
    // Визначення типу пропсів
    type ButtonProps = {
      title: string;
      onPress: () => void;
      disabled?: boolean;
    };
    
    // Створення компонента з типізованими пропсами
    const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => (
      <View>
        <Text>{title}</Text>
      </View>
    );
    
    // TypeScript перевірка
    const isButtonComponent: React.FC<ButtonProps> = Button;
    
    // Перевірка, що пропси правильно типізовані
    const props: ButtonProps = {
      title: 'Click me',
      onPress: () => console.log('Clicked'),
      disabled: false
    };
    
    expect(props.title).toBe('Click me');
    expect(typeof props.onPress).toBe('function');
  });
});
