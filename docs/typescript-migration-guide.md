# Посібник з міграції на TypeScript для PerekypApp

Цей документ містить детальну інформацію про процес міграції проекту PerekypApp з JavaScript на TypeScript, а також рекомендації та найкращі практики для розробників.

## Зміст

- [Вступ](#вступ)
- [Переваги TypeScript](#переваги-typescript)
- [Процес міграції](#процес-міграції)
- [Структура типів](#структура-типів)
- [Найкращі практики](#найкращі-практики)
- [Поширені проблеми та їх вирішення](#поширені-проблеми-та-їх-вирішення)
- [Корисні ресурси](#корисні-ресурси)

## Вступ

Проект PerekypApp був повністю мігрований з JavaScript на TypeScript для покращення якості коду, типобезпеки та підтримки IDE. Міграція була виконана поетапно, починаючи з базових утиліт та компонентів, і закінчуючи складними екранами та інтеграцією з API.

## Переваги TypeScript

Використання TypeScript у проекті надає наступні переваги:

1. **Статична типізація**: виявлення помилок на етапі компіляції, а не під час виконання
2. **Покращена підтримка IDE**: автодоповнення, підказки типів, навігація по коду
3. **Краща документація**: типи служать як документація для API та компонентів
4. **Безпечний рефакторинг**: зміни в API автоматично виявляються в усіх місцях використання
5. **Краща масштабованість**: легше підтримувати великі кодові бази

## Процес міграції

Міграція проекту на TypeScript була виконана в наступні етапи:

### 1. Налаштування оточення

- Встановлення TypeScript та залежностей
- Налаштування tsconfig.json
- Конфігурація Babel для підтримки TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "jsx": "react-native",
    "strict": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "*": ["src/*"]
    }
  },
  "include": ["src", "components", "App.tsx"],
  "exclude": ["node_modules", "babel.config.js", "metro.config.js"]
}
```

### 2. Створення базових типів

- Створення типів для моделей даних (користувачі, автомобілі, витрати тощо)
- Типи для навігації
- Типи для API-відповідей
- Типи для стану додатку (Zustand)

```typescript
// src/types/models/Car.ts
export interface Car {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  license_plate?: string;
  color?: string;
  mileage: number;
  purchase_price: number;
  purchase_date?: string;
  sold_price?: number;
  sold_date?: string;
  status: 'active' | 'sold' | 'reserved' | 'maintenance';
  created_at: string;
  updated_at: string;
}
```

### 3. Міграція утиліт та сервісів

- Конвертація файлів з `/src/utils`
- Конвертація файлів з `/src/services`
- Типізація API-запитів та відповідей

### 4. Міграція компонентів

- Конвертація базових UI-компонентів
- Конвертація складних компонентів
- Додавання типів для пропсів та стану

```typescript
// Приклад міграції компонента
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  // Реалізація компонента
};
```

### 5. Міграція екранів

- Конвертація екранів автентифікації
- Конвертація головних екранів
- Конвертація екранів управління автомобілями, витратами тощо

### 6. Міграція управління станом

- Типізація Zustand сторів
- Інтеграція з devtools
- Типізація селекторів та дій

```typescript
// Приклад типізованого Zustand стору
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (email, password) => {
    // Реалізація
  },
  logout: async () => {
    // Реалізація
  },
}));
```

### 7. Оптимізація та рефакторинг

- Використання ESLint для TypeScript
- Виявлення типів any та заміна їх на конкретні типи
- Оптимізація імпортів
- Аналіз розміру бандлу
- Ліниве завантаження компонентів
- Оптимізація зображень

## Структура типів

Типи в проекті організовані за наступною структурою:

```
src/types/
├── components/       # Типи для компонентів
├── models/           # Типи для моделей даних
├── navigation/       # Типи для навігації
├── screens/          # Типи для екранів
├── store/            # Типи для Zustand сторів
└── api/              # Типи для API-запитів та відповідей
```

## Найкращі практики

### Загальні рекомендації

1. **Уникайте використання `any`**: Завжди намагайтеся використовувати конкретні типи замість `any`
2. **Використовуйте інтерфейси для пропсів**: Створюйте інтерфейси для пропсів компонентів
3. **Документуйте типи**: Додавайте JSDoc коментарі до типів та інтерфейсів
4. **Використовуйте строгу типізацію**: Включіть `strict: true` в tsconfig.json

### Типізація компонентів

```typescript
// Правильно
interface CardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onPress }) => {
  // ...
};

// Неправильно
const Card = ({ title, description, onPress }) => {
  // ...
};
```

### Типізація хуків

```typescript
// Правильно
function useCounter(initialValue: number): {
  count: number;
  increment: () => void;
  decrement: () => void;
} {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);
  
  return { count, increment, decrement };
}

// Неправильно
function useCounter(initialValue) {
  // ...
}
```

### Типізація API-запитів

```typescript
// Правильно
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

async function login(data: LoginRequest): Promise<LoginResponse> {
  // ...
}

// Неправильно
async function login(data) {
  // ...
}
```

## Поширені проблеми та їх вирішення

### Проблема з типами для стилів

**Проблема**: Складність типізації стилів для React Native компонентів

**Рішення**: Використання типів `ViewStyle`, `TextStyle` та `ImageStyle` з React Native

```typescript
import { ViewStyle, TextStyle, StyleSheet } from 'react-native';

interface ButtonStyleProps {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<ButtonStyleProps>({
  container: {
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### Проблема з типами для сторонніх бібліотек

**Проблема**: Відсутність або неповні типи для сторонніх бібліотек

**Рішення**: Створення власних типів або використання `@types` пакетів

```typescript
// Для бібліотек без типів
declare module 'some-library' {
  export function someFunction(param: string): number;
  export class SomeClass {
    constructor(options: { key: string });
    method(): void;
  }
}
```

### Проблема з типізацією динамічних об'єктів

**Проблема**: Складність типізації об'єктів з динамічними ключами

**Рішення**: Використання індексних сигнатур або Record типу

```typescript
// Використання індексної сигнатури
interface Dictionary {
  [key: string]: string;
}

// Використання Record
type Dictionary = Record<string, string>;
```

## Корисні ресурси

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Native TypeScript Transformer](https://github.com/ds300/react-native-typescript-transformer)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand#typescript-usage)

## Висновок

Міграція проекту PerekypApp на TypeScript значно покращила якість коду, зменшила кількість помилок під час виконання та прискорила розробку завдяки кращій підтримці IDE. Хоча процес міграції вимагав значних зусиль, переваги TypeScript повністю виправдали ці витрати.

Дотримуйтесь рекомендацій та найкращих практик, описаних у цьому документі, для підтримки високої якості коду та ефективної розробки.
