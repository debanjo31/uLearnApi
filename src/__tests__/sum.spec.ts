import { describe, expect, it } from 'vitest';
import { addSum } from '#utils/sum.js';

describe('addSum function', () => {
  it('should add two positive numbers correctly', () => {
    expect(addSum(1, 2)).toBe(3);
  });
});
