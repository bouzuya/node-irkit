import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKitDevice as IRKitDevice_ } from '../../src/irkit-device';
import { IRKitMessage } from '../../src/irkit-message';

interface Context {
  device: IRKitDevice_;
  fetch: sinon.SinonStub;
  message: IRKitMessage;
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
  const message = JSON.parse('{"format":"raw","freq":38,"data":[1, 2, 3]}');
  return Promise.resolve({
    device,
    fetch,
    message
  });
};

const category = '/irkit-device (postMessages) ';
const tests: Test[] = [
  test(
    category,
    fixture(before, (_) => void 0, ({ device, fetch, message }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('')
      }));
      return device.postMessages(message).then(() => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'http://192.168.1.2/messages');
        assert(args[1].method === 'POST');
        assert.deepEqual(args[1].body, JSON.stringify(message));
      });
    })
  ),
  test(
    category + 'an error',
    fixture(before, (_) => void 0, ({ device, fetch, message }) => {
      fetch.returns(Promise.resolve({
        status: 500
      }));
      return device.postMessages(message).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 500'); // internal api
      });
    })
  )
];

export { tests };
