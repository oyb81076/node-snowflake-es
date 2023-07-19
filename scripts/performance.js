/* eslint-disable no-console */
// eslint-disable-next-line import/extensions
import snowflake from '../dist/snowflake.js';

// 性能在 macos 上在 4k/ms
// 在 ecs linux 上 3622/ms
for (let k = 0; k < 10; k++) {
  const count = 10000000;
  const start = process.hrtime();
  for (let i = 0; i < count; i++) snowflake();
  const end = process.hrtime();
  const ms = (end[0] - start[0]) * 1e3 + (end[1] - start[1]) / 1e6;
  console.log('count: %i, time: %sms, %i/ms', count, ms.toFixed(3), count / ms);
}
