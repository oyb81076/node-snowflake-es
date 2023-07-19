import { randomInt } from 'node:crypto';

const WORKER_BITS = 7;
const CLOCK_BITS = 2;
const SEQUENCE_BITS = 12;
const TIMESTAMP_SHIFT = WORKER_BITS + CLOCK_BITS + SEQUENCE_BITS; // 21
const TW_EPOCH = 1451606400000; // 2016-01-01

function createSequence() {
  const sequenceMask: number = (1 << SEQUENCE_BITS) - 1;
  const { now } = Date;
  let sequence = 0;
  const clocks = [...Array<void>(1 << CLOCK_BITS)].map((_, i) => ({
    lastTimestamp: 0,
    clockId: i << SEQUENCE_BITS,
  }));
  let { lastTimestamp, clockId } = clocks[0];
  const result: [timestamp: number, clockAndSeq: number] = [0, 0];

  return function next(): [timestamp: number, clockAndSeq: number] {
    let timestamp = now();
    if (timestamp > lastTimestamp) {
      sequence = randomInt(256);
    } else if (timestamp === lastTimestamp) {
      sequence += 1;
      if (sequence > sequenceMask) {
        const clock = clocks
          .filter((x) => x.clockId !== clockId && x.lastTimestamp < timestamp)
          .sort((a, b) => b.lastTimestamp - a.lastTimestamp)[0];
        if (clock) {
          // Borrow a clock
          clocks.find((x) => x.clockId === clockId)!.lastTimestamp = lastTimestamp;
          lastTimestamp = clock.lastTimestamp;
          clockId = clock.clockId;
          sequence = 0;
        } else {
          do {
            timestamp = now();
          } while (timestamp === lastTimestamp);
          sequence = randomInt(256);
        }
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
      sequence = randomInt(256);
    }
    lastTimestamp = timestamp;
    result[0] = timestamp;
    result[1] = clockId + sequence;
    return result;
  };
}

export function createSnowflake(workerId = 0): () => bigint {
  if (workerId < 0) throw new Error('workerId should greater then 0');
  if (workerId > (1 << WORKER_BITS) - 1)
    throw new Error(`workerId must less than maxDataCenterId-[${(1 << WORKER_BITS) - 1}]`);
  const timestampShift = BigInt(TIMESTAMP_SHIFT); // 41
  const twEpoch = TW_EPOCH; // 2016-01-01
  const center = BigInt(workerId << (SEQUENCE_BITS + CLOCK_BITS));
  const next = createSequence();
  return function snowflake() {
    const [timestamp, clockAndSeq] = next();
    return (BigInt(timestamp - twEpoch) << timestampShift) + center + BigInt(clockAndSeq);
  };
}

const snowflake = createSnowflake(parseInt(process.env.SNOWFLAKE_WORKER_ID || '0', 10));
export default snowflake;
