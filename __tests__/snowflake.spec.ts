import snowflake from '../src/snowflake.js';

it('create 5000', () => {
  const count = 1;
  const array = Array<bigint>(count).fill(0n).map(snowflake);
  expect(new Set(array).size).toBe(count);
  expect(array).toEqual(array.slice(0).sort());
});
