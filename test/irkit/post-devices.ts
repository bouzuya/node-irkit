import { Test, test } from 'beater';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';
import { fixture } from '../_';

interface Context {
  clientkey: string;
  fetch: sinon.SinonStub;
  internet: IRKit_;
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
    internet,
    message
  });
};

const category = '/irkit (postDevices) ';
const tests: Test[] = [
  test(
    category,
    fixture({ before }, ({
      clientkey,
      fetch,
      internet
    }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('{"deviceid":"XXX","devicekey":"YYY"}')
      }));
      return internet.postDevices({
        clientkey
      }).then(({ deviceid, devicekey }) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'https://api.getirkit.com/1/devices');
        assert(args[1].method === 'POST');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert(args[1].body === JSON.stringify({ clientkey }));
        assert(deviceid === 'XXX');
        assert(devicekey === 'YYY');
      });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture({ before }, ({ clientkey, fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.postDevices({ clientkey }).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 401'); // internal api
      });
    })
  )
];

export { tests };
