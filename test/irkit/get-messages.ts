import { Test, test } from 'beater';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';
import { IRKitMessage } from '../../src/irkit-message';
import { fixture } from '../_';

interface Context {
  clientkey: string;
  deviceid: string;
  fetch: sinon.SinonStub;
  hostname: string;
  internet: IRKit_;
  message: IRKitMessage;
}

const before = (): Promise<Context> => {
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
    hostname: 'hostname1',
    internet,
    message
  });
};

const category = '/irkit (getMessages) ';
const tests: Test[] = [
  test(
    category + 'no clear',
    fixture({ before }, ({
      clientkey,
      deviceid,
      fetch,
      hostname,
      internet,
      message
    }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve(JSON.stringify({
          deviceid,
          hostname,
          message
        }))
      }));
      return internet.getMessages({ clientkey }).then((m) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(
          args[0] ===
          'https://api.getirkit.com/1/messages?clientkey=clientkey1'
        );
        assert(args[1].method === 'GET');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert.deepEqual(m, {
          deviceid,
          hostname,
          message
        });
      });
    })
  ),
  test(
    category + 'with clear',
    fixture({ before }, ({ clientkey, fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('')
      }));
      return internet.getMessages({ clear: 1, clientkey }).then((m) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(
          args[0] ===
          'https://api.getirkit.com/1/messages?clear=1&clientkey=clientkey1'
        );
        assert(args[1].method === 'GET');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert(m === null);
      });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture({ before }, ({ clientkey, fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.getMessages({
        clientkey
      }).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 401'); // internal api
      });
    })
  )
];

export { tests };
