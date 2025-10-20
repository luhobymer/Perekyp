# Шаблони JSDoc для проекту PerekypApp

## Шаблон для компонентів React

```typescript
/**
 * @component
 * @description Короткий опис компонента та його призначення
 * 
 * @example
 * // Приклад використання компонента
 * <ComponentName prop1="value1" prop2={value2} />
 * 
 * @param {Object} props - Властивості компонента
 * @param {string} props.prop1 - Опис першої властивості
 * @param {number} props.prop2 - Опис другої властивості
 * @param {Function} props.onSomeEvent - Функція зворотного виклику для певної події
 * 
 * @returns {JSX.Element} Відрендерений компонент
 */
```

## Шаблон для функцій та методів

```typescript
/**
 * @function
 * @description Короткий опис функції та її призначення
 * 
 * @example
 * // Приклад використання функції
 * const result = functionName(param1, param2);
 * 
 * @param {string} param1 - Опис першого параметра
 * @param {number} param2 - Опис другого параметра
 * @param {Object} [optionalParam] - Опис необов'язкового параметра
 * @param {string} [optionalParam.subParam] - Опис вкладеного параметра
 * 
 * @returns {ReturnType} Опис того, що повертає функція
 * @throws {ErrorType} Опис помилок, які можуть виникнути
 */
```

## Шаблон для класів

```typescript
/**
 * @class
 * @description Короткий опис класу та його призначення
 * 
 * @example
 * // Приклад створення екземпляра класу
 * const instance = new ClassName(param1, param2);
 * instance.someMethod();
 * 
 * @param {string} param1 - Опис першого параметра конструктора
 * @param {number} param2 - Опис другого параметра конструктора
 */
```

## Шаблон для методів класу

```typescript
/**
 * @method
 * @description Короткий опис методу та його призначення
 * 
 * @example
 * // Приклад використання методу
 * instance.methodName(param1, param2);
 * 
 * @param {string} param1 - Опис першого параметра
 * @param {number} param2 - Опис другого параметра
 * 
 * @returns {ReturnType} Опис того, що повертає метод
 * @throws {ErrorType} Опис помилок, які можуть виникнути
 */
```

## Шаблон для типів та інтерфейсів

```typescript
/**
 * @interface
 * @description Короткий опис інтерфейсу та його призначення
 * 
 * @property {string} prop1 - Опис першої властивості
 * @property {number} prop2 - Опис другої властивості
 * @property {Function} [optionalProp] - Опис необов'язкової властивості
 */
```

## Шаблон для хуків

```typescript
/**
 * @hook
 * @description Короткий опис хука та його призначення
 * 
 * @example
 * // Приклад використання хука
 * const result = useHookName(param1, param2);
 * 
 * @param {string} param1 - Опис першого параметра
 * @param {number} param2 - Опис другого параметра
 * 
 * @returns {Object} Об'єкт з результатами хука
 * @returns {string} result.value - Опис першого результату
 * @returns {Function} result.setValue - Опис функції для зміни значення
 */
```

## Шаблон для контекстів

```typescript
/**
 * @context
 * @description Короткий опис контексту та його призначення
 * 
 * @example
 * // Приклад використання контексту
 * const contextValue = useContext(ContextName);
 * 
 * @property {string} prop1 - Опис першої властивості контексту
 * @property {Function} action1 - Опис першої дії контексту
 */
```

## Шаблон для сторів Zustand

```typescript
/**
 * @store
 * @description Короткий опис стору та його призначення
 * 
 * @example
 * // Приклад використання стору
 * const { value, setValue } = useStoreName();
 * 
 * @property {string} value - Опис значення в сторі
 * @property {Function} setValue - Опис функції для зміни значення
 */
```
