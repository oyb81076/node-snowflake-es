import { randomInt } from 'node:crypto';

interface CreateSequenceOptions {
  randomSequence: number;
  sequenceBits: number;
  clockBits: number;
}
function createSequence({ randomSequence, sequenceBits, clockBits }: CreateSequenceOptions) {
  const sequenceMask = (1 << sequenceBits) - 1;
  const { now } = Date;
  let sequence = 0;
  const clocks = [...Array<void>(1 << clockBits)].map((_, i) => ({
    lastTimestamp: 0,
    clockId: i << sequenceBits,
  }));
  let { lastTimestamp, clockId } = clocks[0];

  return function next(): [timestamp: number, clock: number, sequence: number] {
    let timestamp = now();
    if (timestamp > lastTimestamp) {
      sequence = randomSequence && randomInt(randomSequence);
    } else if (timestamp === lastTimestamp) {
      sequence += 1;
      if (sequence > sequenceMask) {
        do {
          timestamp = now();
        } while (timestamp === lastTimestamp);
        sequence = randomSequence && randomInt(randomSequence);
      }
    } else {
      clocks.find((x) => x.clockId === clockId)!.lastTimestamp = lastTimestamp;
      // 取最大时钟
      const clock = clocks
        .filter((x) => x.lastTimestamp < timestamp)
        .sort((a, b) => b.lastTimestamp - a.lastTimestamp)[0];
      if (!clock) {
        throw new Error(`Clock moved backwards`);
      }
      lastTimestamp = clock.lastTimestamp;
      clockId = clock.clockId;
      sequence = randomSequence && randomInt(randomSequence);
    }
    lastTimestamp = timestamp;
    return [timestamp, clockId, sequence];
  };
}

interface Options {
  // workerId 默认0
  workerId?: number;
  // sequence 起始值随机数字 默认128
  randomSequence?: number;
  // workerId 所占位数 默认7
  workerBits?: number;
  // 时钟所占位数 默认2
  clockBits?: number;
  // 序列号所占位数 默认12
  sequenceBits?: number;
  // 时间偏移量, 默认为 1451606400000 (2016-01-01)
  twEpoch?: number;
}
export function createSnowflake({
  workerId = 0,
  randomSequence = 128,
  workerBits = 7,
  clockBits = 2,
  sequenceBits = 12,
  twEpoch = 1451606400000,
}: Options = {}): () => bigint {
  if (workerId < 0) throw new Error('workerId should greater then 0');
  if (workerId > (1 << workerBits) - 1)
    throw new Error(`workerId must less than maxDataCenterId-[${(1 << workerBits) - 1}]`);
  if (randomSequence < 0) throw new Error('randomSequence should greater then 0');
  if (randomSequence > 1 << (sequenceBits - 2)) throw new Error('randomSequence is too bigger');
  if (workerBits + clockBits + sequenceBits > 22)
    throw new Error('workerBits + clockBits + sequenceBits should lower then 22');
  const timestampShift = BigInt(workerBits + clockBits + sequenceBits); // 41
  const center = BigInt(workerId << (sequenceBits + clockBits));
  const next = createSequence({ randomSequence, sequenceBits, clockBits });
  return function snowflake() {
    const [timestamp, clock, sequence] = next();
    return (BigInt(timestamp - twEpoch) << timestampShift) + center + BigInt(clock + sequence);
  };
}
function tryParseInt(v: string | undefined): number | undefined {
  return v ? parseInt(v, 10) : undefined;
}
const snowflake = createSnowflake({
  workerId: tryParseInt(process.env.SNOWFLAKE_WORKER_ID),
  randomSequence: tryParseInt(process.env.SNOWFLAKE_RANDOM_SEQUENCE),
  workerBits: tryParseInt(process.env.SNOWFLAKE_WORKER_BITS),
  clockBits: tryParseInt(process.env.SNOWFLAKE_CLOCK_BITS),
  sequenceBits: tryParseInt(process.env.SNOWFLAKE_SEQUENCE_BITS),
  twEpoch: tryParseInt(process.env.SNOWFLAKE_TW_EPOCH),
});
export default snowflake;
