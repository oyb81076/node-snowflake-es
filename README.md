# snowflake 变种

## Install

pnpm install node-snowflake-es

## Usage

```js
import snowflake from 'node-snowflake-es';
console.log(snowflake());
```

```js
import { createSnowflake } from 'node-snowflake-es';
const snowflake = createSnowflake(1);
```

```sh
# 修改snowflake workerId 默认值
SNOWFLAKE_WORKER_ID=1 node xxxx.js
```

## BIT位说明

- bit位说明: (timestamp | worker | clock | sequence)
- 时间位(timestamp): 41bit 最大支持到 2155-05-15T07:35:11.104Z
- 机器位(worker): 7bit 0 ~ 127
- 时钟位(clock): 2bit 0 ~ 3
- 序列号(sequence): 12bit 0 ~ 4095

## 支持特性

- 支持128个不同的workerId
- 最大id生成速度 16k/ms (macos下平均4.5k/ms)
- 支持时钟回拨, 允许连续三次时钟回拨
- 支持首个id位0~255的随机数 (便于分表分库)

## 性能测试

`pnpm build`
`pnpm performance`
