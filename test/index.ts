import { Test, run, test } from 'beater';
import assert from 'power-assert';
import { IRKitDevice } from '../src';
import { tests as addTests } from './add';
import { tests as irkitDeviceTests } from './irkit-device';

const category = '/index ';
const tests: Test[] = [
  test(category + 'IRKitDevice', () => {
    assert(IRKitDevice);
  })
]
  .concat(addTests)
  .concat(irkitDeviceTests);

run(tests).catch(() => process.exit(1));
