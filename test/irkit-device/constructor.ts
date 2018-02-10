import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import { IRKitDevice } from '../../src/irkit-device';

const category = '/irkit-device (constructor) ';
const tests: Test[] = [
  test(
    category + 'no options',
    fixture(
      () => {
        const originalIp = process.env.IRKIT_DEVICE_IP;
        return Promise.resolve({ originalIp });
      },
      ({ originalIp }) => {
        process.env.IRKIT_DEVICE_IP = originalIp;
      },
      (_) => {
        delete process.env.IRKIT_DEVICE_IP;
        assert.throws(() => new IRKitDevice());
      })
  ),
  test(
    category + 'no deviceIp',
    fixture(
      () => {
        const originalIp = process.env.IRKIT_DEVICE_IP;
        return Promise.resolve({ originalIp });
      },
      ({ originalIp }) => {
        process.env.IRKIT_DEVICE_IP = originalIp;
      },
      (_) => {
        delete process.env.IRKIT_DEVICE_IP;
        assert.throws(() => new IRKitDevice({}));
      })
  ),
  test(
    category + 'deviceIp from options',
    fixture(
      () => {
        const originalIp = process.env.IRKIT_DEVICE_IP;
        return Promise.resolve({ originalIp });
      },
      ({ originalIp }) => {
        process.env.IRKIT_DEVICE_IP = originalIp;
      },
      (_) => {
        delete process.env.IRKIT_DEVICE_IP;
        const device = new IRKitDevice({ deviceIp: '192.168.1.2' });
        assert(device.getDeviceIp() === '192.168.1.2');
      })
  ),
  test(
    category + 'deviceIp from env',
    fixture(
      () => {
        const originalIp = process.env.IRKIT_DEVICE_IP;
        return Promise.resolve({ originalIp });
      },
      ({ originalIp }) => {
        process.env.IRKIT_DEVICE_IP = originalIp;
      },
      (_) => {
        process.env.IRKIT_DEVICE_IP = '192.168.1.3';
        const device = new IRKitDevice();
        assert(device.getDeviceIp() === '192.168.1.3');
      })
  )
];

export { tests };
