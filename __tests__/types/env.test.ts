import { 
  getApiTimeout, 
  getCacheLifetime, 
  getAnalyticsEnabled, 
  getEnvironment, 
  getSupabaseUrl, 
  getSupabaseAnonKey 
} from '../../src/utils/env';
import { Environment } from '../../src/types/env';

/**
 * Тести для перевірки типів функцій з модуля env
 * 
 * Ці тести перевіряють, що функції повертають значення правильного типу
 */
describe('Env Types', () => {
  test('getApiTimeout повертає number', () => {
    const timeout = getApiTimeout();
    // TypeScript перевірка
    const isNumber: number = timeout;
    // Jest перевірка
    expect(typeof timeout).toBe('number');
  });

  test('getCacheLifetime повертає number', () => {
    const lifetime = getCacheLifetime();
    // TypeScript перевірка
    const isNumber: number = lifetime;
    // Jest перевірка
    expect(typeof lifetime).toBe('number');
  });

  test('getAnalyticsEnabled повертає boolean', () => {
    const enabled = getAnalyticsEnabled();
    // TypeScript перевірка
    const isBoolean: boolean = enabled;
    // Jest перевірка
    expect(typeof enabled).toBe('boolean');
  });

  test('getEnvironment повертає Environment', () => {
    const env = getEnvironment();
    // TypeScript перевірка
    const isEnvironment: Environment = env;
    // Jest перевірка
    expect(['development', 'staging', 'production']).toContain(env);
  });

  test('getSupabaseUrl повертає string', () => {
    const url = getSupabaseUrl();
    // TypeScript перевірка
    const isString: string = url;
    // Jest перевірка
    expect(typeof url).toBe('string');
  });

  test('getSupabaseAnonKey повертає string', () => {
    const key = getSupabaseAnonKey();
    // TypeScript перевірка
    const isString: string = key;
    // Jest перевірка
    expect(typeof key).toBe('string');
  });
});
