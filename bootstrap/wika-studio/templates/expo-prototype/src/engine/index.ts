/**
 * Lógica pura del prototipo. Regla WIKA: sin imports de React ni de UI.
 * Ejemplo mínimo: un contador con límites, para demostrar separación engine/UI.
 */
export interface CounterState {
  value: number;
  min: number;
  max: number;
}

export function createCounter(min = 0, max = 99): CounterState {
  return { value: min, min, max };
}

export function increment(state: CounterState, step = 1): CounterState {
  return { ...state, value: Math.min(state.max, state.value + step) };
}

export function decrement(state: CounterState, step = 1): CounterState {
  return { ...state, value: Math.max(state.min, state.value - step) };
}
