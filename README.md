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
const snowflake = createSnowflake({
  workerId: 0, // 机器编号, 默认0, 不能超过 workerBits 规定的取值范围
  randomSequence: 128, // 默认128, 随机序列号开始值, 用于分库分表
  workerBits: 7, // 机器编号占的位数, 默认7
  clockBits: 2, // 时钟编号占用位数, 默认2, 时钟编号会因为时钟回拨自动切换
  sequenceBits: 12, // 序列号占用位数, 默认12,
  twEpoch: 1451606400000, // 时间开始编号, 默认1451606400000, 对应时间为 '2016-01-01T00:00:00.000Z'
});
```

## 通过环境变量修改snowflake默认值

```sh
 SNOWFLAKE_WORKER_ID=1 SNOWFLAKE_RANDOM_SEQUENCE=8 SNOWFLAKE_WORKER_BITS=7 SNOWFLAKE_CLOCK_BITS=2 SNOWFLAKE_SEQUENCE_BITS=12 SNOWFLAKE_TW_EPOCH=1451606400000 node xxxx.js
```

## 命令行随机生成

- `npx node-snowflake-cli` 随机生成1个
- `npx node-snowflake-cli 20` 随机生成10个

## 默认BIT位说明

- bit位说明: (timestamp | worker | clock | sequence)
- 时间位(timestamp): 41bit 最大支持到 2155-05-15T07:35:11.104Z
- 机器位(worker): 7bit 0 ~ 127
- 时钟位(clock): 2bit 0 ~ 3
- 序列号(sequence): 12bit 0 ~ 4095

## 支持特性

- 支持128个不同的workerId
- 最大id生成速度 4k/ms
- 支持时钟回拨, 允许连续三次时钟回拨
- 支持首个id位为随机数 (便于分表分库)

## 基准测试

- `pnpm build`
- `pnpm benchmark`
