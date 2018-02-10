import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';
import { IRKitMessage } from '../../src/irkit-message';

interface Context {
  clientkey: string;
  deviceid: string;
  fetch: sinon.SinonStub;
  internet: IRKit_;
  message: IRKitMessage;
}

const setUp = (): Promise<Context> => {
  const fetch = sinon.stub();
  const IRKit: typeof IRKit_ = proxyquire(
    '../../src/irkit',
    {
      './_': { fetch }
    }
  ).IRKit;
  const internet = new IRKit();
  const message = JSON.parse('{"format":"raw","freq":38,"data":[1, 2, 3]}');
  return Promise.resolve({
    clientkey: 'clientkey1',
    deviceid: 'deviceid1',
    fetch,
    internet,
    message
  });
};

const category = '/irkit (postMessages) ';
const tests: Test[] = [
  test(
    category,
    fixture(setUp, (_) => void 0, ({
      clientkey,
      deviceid,
      fetch,
      internet,
      message
    }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('')
      }));
      return internet.postMessages({
        clientkey,
        deviceid,
        message
      }).then(() => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'https://api.getirkit.com/1/messages');
        assert(args[1].method === 'POST');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert(args[1].body === JSON.stringify({
          clientkey,
          deviceid,
          message: JSON.stringify(message)
        }));
      });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture(setUp, (_) => void 0, (context) => {
      const {
        clientkey,
        deviceid,
        fetch,
        internet,
        message
      } = context!;
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.postMessages({
        clientkey,
        deviceid,
        message
      }).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 401'); // internal api
      });
    })
  )
];

export { tests };
