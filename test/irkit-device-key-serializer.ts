import { Test, test } from 'beater';
import assert from 'power-assert';
import { Security, serialize } from '../src/irkit-device-key-serializer';

const category = '/device-key-serializer ';
const tests: Test[] = [
  test(category, () => {
    assert(
      serialize({
        devicekey: '9A0E8DF564C34712A4EDD0933C3CB1E8',
        password: 'hogehige',
        security: Security.WPA_WPA2,
        ssid: '6s'
      }) ===
      '8/3673/686F676568696765/9A0E8DF564C34712A4EDD0933C3CB1E8/2//////A4'
    );
  })
];

export { tests };
