import { createSnowflake } from '../src/snowflake.js';

jest.mock('node:crypto', () => ({
  randomInt: () => 0,
}));

it('clock recover', () => {
  const current = Date.now();
  const times = [current, current - 1, current - 2, current - 3, current, current - 1];
  jest.spyOn(Date, 'now').mockImplementation(() => times.shift()!);
  const snowflake = createSnowflake();
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 0n) << 22n) + (0n << 12n));
  // 第1次回拨
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 1n) << 22n) + (1n << 12n));
  // 第2次回拨
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 2n) << 22n) + (2n << 12n));
  // 第3次回拨
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 3n) << 22n) + (3n << 12n));
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 0n) << 22n) + (3n << 12n));
  // 第4次回拨
  expect(snowflake()).toEqual(((BigInt(current) - 1288834974657n - 1n) << 22n) + (2n << 12n));
});
