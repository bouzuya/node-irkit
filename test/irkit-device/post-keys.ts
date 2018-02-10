import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKitDevice as IRKitDevice_ } from '../../src/irkit-device';

interface Context {
  device: IRKitDevice_;
  fetch: sinon.SinonStub;
}

const before = (): Promise<Context> => {
  const fetch = sinon.stub();
  const IRKitDevice: typeof IRKitDevice_ = proxyquire(
    '../../src/irkit-device',
    {
      './_': { fetch }
    }
  ).IRKitDevice;
  const device = new IRKitDevice({ deviceIp: '192.168.1.2' });
  return Promise.resolve({
    device,
    fetch
  });
};

const category = '/irkit-device (postKeys) ';
const tests: Test[] = [
  test(
    category,
    fixture(before, (_) => void 0, ({ device, fetch }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('{"clienttoken":"XXXX"}')
      }));
      return device.postKeys().then((key) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'http://192.168.1.2/keys');
        assert(args[1].method === 'POST');
        assert(key.clienttoken === 'XXXX');
      });
    })
  ),
  test(
    category + 'an error',
    fixture(before, (_) => void 0, ({ device, fetch }) => {
      fetch.returns(Promise.resolve({
        status: 500
      }));
      return device.postKeys().then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 500'); // internal api
      });
    })
  )
];

export { tests };
