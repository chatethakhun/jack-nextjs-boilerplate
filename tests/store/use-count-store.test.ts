// counter-store.test.ts
import { describe, test, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@/store/use-counter-store';

describe('Counter Store', () => {
  
  beforeEach(() => {
    // Reset store ก่อนแต่ละ test
    useCounterStore.setState({ count: 0 });
  });

  test('initial state should be 0', () => {
    const { count } = useCounterStore.getState();
    expect(count).toBe(0);
  });

  test('increment increases count by 1', () => {
    const { increment } = useCounterStore.getState();
    
    increment();
    expect(useCounterStore.getState().count).toBe(1);
    
    increment();
    expect(useCounterStore.getState().count).toBe(2);
  });

  test('decrement decreases count by 1', () => {
    const { decrement } = useCounterStore.getState();
    
    // ตั้งค่าเริ่มต้น
    useCounterStore.setState({ count: 5 });
    
    decrement();
    expect(useCounterStore.getState().count).toBe(4);
    
    decrement();
    expect(useCounterStore.getState().count).toBe(3);
  });

  test('decrement can go below zero', () => {
    const { decrement } = useCounterStore.getState();
    
    decrement();
    expect(useCounterStore.getState().count).toBe(-1);
    
    decrement();
    expect(useCounterStore.getState().count).toBe(-2);
  });

  test('reset sets count back to 0', () => {
    const { increment, reset } = useCounterStore.getState();
    
    increment();
    increment();
    increment();
    expect(useCounterStore.getState().count).toBe(3);
    
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });

  test('multiple operations work correctly', () => {
    const { increment, decrement, reset } = useCounterStore.getState();
    
    increment(); // 1
    increment(); // 2
    increment(); // 3
    decrement(); // 2
    increment(); // 3
    
    expect(useCounterStore.getState().count).toBe(3);
    
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });

  test('state updates are immutable', () => {
    const initialState = useCounterStore.getState();
    const { increment } = useCounterStore.getState();
    
    increment();
    const newState = useCounterStore.getState();
    
    expect(initialState).not.toBe(newState);
    expect(initialState.count).toBe(0);
    expect(newState.count).toBe(1);
  });
});