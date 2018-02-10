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

const category = '/irkit-device (getMessages) ';
const tests: Test[] = [
  test(
    category + 'no message',
    fixture(before, (_) => void 0, ({ device, fetch }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('')
      }));
      return device.getMessages().then((message) => {
        assert(fetch.callCount === 1);
        assert(fetch.getCall(0).args.length === 2);
        assert(fetch.getCall(0).args[0] === 'http://192.168.1.2/messages');
        assert(fetch.getCall(0).args[1].method === 'GET');
        assert(message === null);
      });
    })
  ),
  test(
    category + 'a message',
    fixture(before, (_) => void 0, ({ device, fetch }) => {
      const message = '{"format":"raw","freq":38,"data":[1, 2, 3]}';
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve(message)
      }));
      return device.getMessages().then((m) => {
        assert.deepEqual(m, JSON.parse(message));
      });
    })
  ),
  test(
    category + 'an error',
    fixture(before, (_) => void 0, ({ device, fetch }) => {
      fetch.returns(Promise.resolve({
        status: 500
      }));
      return device.getMessages().then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 500'); // internal api
      });
    })
  )
];

export { tests };
