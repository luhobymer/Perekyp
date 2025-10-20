import { useReducer, useCallback } from 'react';

// Типи для оптимізованого стану
export type StateType = Record<string, unknown>;

export type ActionType = 
  | { type: 'SET'; payload: StateType }
  | { type: 'UPDATE'; field: string; value: unknown }
  | { type: 'RESET' };

export const useOptimizedState = <T extends StateType>(initialState: T) => {
  const reducer = (state: T, action: ActionType): T => {
    switch (action.type) {
      case 'SET':
        return { ...state, ...action.payload };
      case 'UPDATE':
        return { ...state, [action.field]: action.value };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = useCallback((newState: Partial<T>) => {
    dispatch({ type: 'SET', payload: newState });
  }, []);

  const updateField = useCallback((field: string, value: unknown) => {
    dispatch({ type: 'UPDATE', field, value });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    setState,
    updateField,
    resetState,
  };
};

export default useOptimizedState;
