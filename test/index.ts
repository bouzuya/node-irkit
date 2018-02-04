import { Test, run, test } from 'beater';
import assert from 'power-assert';
import { IRKitDevice, Message, Security } from '../src';
import { tests as irkitDeviceTests } from './irkit-device';
import {
  tests as irkitDeviceKeySerializerTests
} from './irkit-device-key-serializer';

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
  .concat(irkitDeviceTests)
  .concat(irkitDeviceKeySerializerTests);

run(tests).catch(() => process.exit(1));
