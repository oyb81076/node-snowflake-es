#!/usr/bin/env node
// eslint-disable-next-line import/extensions
import snowflake from '../dist/snowflake.js';

let count = 1;
if (process.argv.length > 2) {
  count = parseInt(process.argv.at(-1) || '1', 10);
  if (count > 100) count = 100;
  if (count <= 0) count = 1;
}

for (let i = 0; i < count; i += 1) {
  // eslint-disable-next-line no-console
  console.log(snowflake().toString());
}
