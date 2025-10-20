import { renderHook } from '@testing-library/react-hooks';
import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Тести для перевірки типів хуків
 * 
 * Ці тести перевіряють, що хуки повертають значення правильного типу
 */
describe('Hook Types', () => {
  test('useState має правильний тип', () => {
    // Використання useState з типом string
    const useStringState = () => {
      const [value, setValue] = useState<string>('');
      return { value, setValue };
    };
    
    // Використання useState з типом number
    const useNumberState = () => {
      const [value, setValue] = useState<number>(0);
      return { value, setValue };
    };
    
    // Використання useState з типом boolean
    const useBooleanState = () => {
      const [value, setValue] = useState<boolean>(false);
      return { value, setValue };
    };
    
    // Використання useState з типом масиву
    const useArrayState = () => {
      const [value, setValue] = useState<string[]>([]);
      return { value, setValue };
    };
    
    // Використання useState з типом об'єкта
    const useObjectState = () => {
      const [value, setValue] = useState<{ name: string; age: number }>({ name: '', age: 0 });
      return { value, setValue };
    };
    
    // Перевірка типів
    const { result: stringResult } = renderHook(() => useStringState());
    const { result: numberResult } = renderHook(() => useNumberState());
    const { result: booleanResult } = renderHook(() => useBooleanState());
    const { result: arrayResult } = renderHook(() => useArrayState());
    const { result: objectResult } = renderHook(() => useObjectState());
    
    // TypeScript перевірка
    const isString: string = stringResult.current.value;
    const isNumber: number = numberResult.current.value;
    const isBoolean: boolean = booleanResult.current.value;
    const isArray: string[] = arrayResult.current.value;
    const isObject: { name: string; age: number } = objectResult.current.value;
    
    // Jest перевірка
    expect(typeof stringResult.current.value).toBe('string');
    expect(typeof numberResult.current.value).toBe('number');
    expect(typeof booleanResult.current.value).toBe('boolean');
    expect(Array.isArray(arrayResult.current.value)).toBe(true);
    expect(typeof objectResult.current.value).toBe('object');
  });
  
  test('useCallback має правильний тип', () => {
    // Використання useCallback з типом функції
    const useCallbackFunction = () => {
      const callback = useCallback<(value: string) => number>((value) => {
        return value.length;
      }, []);
      
      return { callback };
    };
    
    // Перевірка типів
    const { result } = renderHook(() => useCallbackFunction());
    
    // TypeScript перевірка
    const isFunction: (value: string) => number = result.current.callback;
    
    // Jest перевірка
    expect(typeof result.current.callback).toBe('function');
    expect(result.current.callback('test')).toBe(4);
  });
  
  test('useMemo має правильний тип', () => {
    // Використання useMemo з типом об'єкта
    const useMemoObject = () => {
      const memo = useMemo<{ name: string; age: number }>(() => {
        return { name: 'John', age: 30 };
      }, []);
      
      return { memo };
    };
    
    // Перевірка типів
    const { result } = renderHook(() => useMemoObject());
    
    // TypeScript перевірка
    const isObject: { name: string; age: number } = result.current.memo;
    
    // Jest перевірка
    expect(typeof result.current.memo).toBe('object');
    expect(result.current.memo.name).toBe('John');
    expect(result.current.memo.age).toBe(30);
  });
});
