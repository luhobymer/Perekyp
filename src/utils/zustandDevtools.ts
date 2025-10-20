import { StateCreator } from 'zustand';

/**
 * Тип для middleware devtools
 */
type DevtoolsOptions = {
  /**
   * Назва стору для відображення в devtools
   */
  name: string;
  /**
   * Чи включено devtools
   */
  enabled?: boolean;
};

/**
 * Middleware для інтеграції Zustand з Redux DevTools
 * @param options - налаштування devtools
 * @returns middleware для Zustand
 */
export const devtools = <T extends object>(options: DevtoolsOptions) => 
  (creator: StateCreator<T, [], []>): StateCreator<T, [], []> => 
  (set, get, api) => {
    // Перевіряємо, чи доступні devtools і чи включено їх
    const isDevtoolsAvailable = 
      typeof window !== 'undefined' && 
      (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    
    const enabled = options.enabled !== false && process.env.NODE_ENV !== 'production';
    
    // Якщо devtools недоступні або вимкнені, повертаємо оригінальний creator
    if (!isDevtoolsAvailable || !enabled) {
      return creator(set, get, api);
    }
    
    // Підключаємо Redux DevTools
    const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    
    // Створюємо екземпляр devtools
    const devtools = extension.connect({
      name: options.name,
    });
    
    // Відправляємо початковий стан
    const initialState = creator(
      (state, replace) => {
        // Формуємо назву дії на основі змін
        const actionName = getActionName(state, replace);
        
        // Оновлюємо стан і відправляємо в devtools
        set(state, replace);
        
        // Відправляємо дію в devtools
        devtools.send(actionName, get());
      },
      get,
      api
    );
    
    // Підписуємося на дії з devtools
    devtools.subscribe((message: any) => {
      if (message.type === 'DISPATCH' && message.state) {
        // Обробляємо команди devtools (наприклад, JUMP_TO_STATE)
        if (
          message.payload.type === 'JUMP_TO_ACTION' ||
          message.payload.type === 'JUMP_TO_STATE'
        ) {
          set(JSON.parse(message.state));
        }
      }
    });
    
    // Відправляємо початковий стан в devtools
    devtools.init(initialState);
    
    return initialState;
  };

/**
 * Отримує назву дії на основі змін стану
 * @param state - новий стан або функція оновлення
 * @param replace - чи замінювати повністю стан
 * @returns назва дії для devtools
 */
const getActionName = (state: any, replace?: boolean): string => {
  // Якщо це функція, повертаємо її ім'я
  if (typeof state === 'function') {
    return state.name || 'anonymous action';
  }
  
  // Якщо це об'єкт, намагаємося визначити, яке поле змінилося
  if (typeof state === 'object' && state !== null) {
    const keys = Object.keys(state);
    if (keys.length === 1) {
      return `update_${keys[0]}`;
    }
    
    if (keys.length > 1) {
      return `update_multiple`;
    }
  }
  
  // За замовчуванням
  return replace ? 'replace_state' : 'update_state';
};
