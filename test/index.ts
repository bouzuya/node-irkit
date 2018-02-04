import { Test, run, test } from 'beater';
import assert from 'power-assert';
import { IRKitDevice, Message } from '../src';
import { tests as addTests } from './add';
import { tests as irkitDeviceTests } from './irkit-device';

const category = '/index ';
const tests: Test[] = [
  test(category + 'IRKitDevice', () => {
    assert(IRKitDevice);
  }),
  test(category + 'Message', () => {
    const message: Message = {
      data: [],
      format: 'raw',
      freq: 38
    };
    assert(message);
  })
]
  .concat(addTests)
  .concat(irkitDeviceTests);

run(tests).catch(() => process.exit(1));
