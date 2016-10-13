/* @flow */

import {
  parseIntParam,
  parseFilterParam,
 } from '..';

describe('parseIntParam', () => {
  it('should handle strings', () => {
    expect(parseIntParam('1', 0)).toBe(1);
  });
  it('should prevent negative numbers', () => {
    expect(parseIntParam('-1', 0)).toBe(0);
  });
  it('should handle defaults', () => {
    expect(parseIntParam(null, 10)).toBe(10);
  });
});
describe('parseFilterParam', () => {
  it('should handle defaults', () => {
    const obj = { op: 'and', content: [] };
    expect(parseFilterParam(null, obj)).toBe(obj);
  });
});
