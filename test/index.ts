import { Test, run, test } from 'beater';
import assert from 'power-assert';
import { IRKit, IRKitDevice, IRKitMessage, Security } from '../src';
import { tests as irkitTests } from './irkit';
import { tests as irkitDeviceTests } from './irkit-device';
import {
  tests as irkitDeviceKeySerializerTests
} from './irkit-device-key-serializer';
import { tests as irkitMessageTests } from './irkit-message';

const category = '/index ';
const tests: Test[] = [
  test(category + 'IRKit', () => {
    assert(IRKit);
  }),
  test(category + 'IRKitDevice', () => {
    assert(IRKitDevice);
  }),
  test(category + 'IRKitMessage', () => {
    const message: IRKitMessage = {
      data: [],
      format: 'raw',
      freq: 38
    };
    assert(message);
  }),
  test(category + 'Security', () => {
    const none: Security = Security.NONE;
    assert(none === 0);
    const wep: Security = Security.WEP;
    assert(wep === 2);
    const wpa: Security = Security.WPA_WPA2;
    assert(wpa === 8);
  })
]
  .concat(irkitTests)
  .concat(irkitDeviceTests)
  .concat(irkitDeviceKeySerializerTests)
  .concat(irkitMessageTests);

run(tests).catch(() => process.exit(1));
