/* eslint-disable no-console */
/* eslint-disable import/extensions */
import snowflake from '../dist/snowflake.js';

// 性能在 macos 上在 4k/ms
// 在 ecs linux 上 3622/ms
const TIME = 10;
const TIME_PER_COUNT = 5_000_000;
for (let k = 0; k < TIME; k++) {
  const start = process.hrtime();
  for (let i = 0; i < TIME_PER_COUNT; i++) snowflake();
  const end = process.hrtime();
  const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) / 1e6;
  console.log('count: %i, time: %sms, %i/ms', TIME_PER_COUNT, ms.toFixed(3), TIME_PER_COUNT / ms);
}
