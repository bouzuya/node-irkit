import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';

interface Context {
  internet: IRKit_;
  fetch: sinon.SinonStub;
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
  return Promise.resolve({
    fetch,
    internet
  });
};

const category = '/irkit (postKeys) ';
const tests: Test[] = [
  test(
    category,
    fixture(before, (_) => void 0, ({ internet, fetch }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('{"clientkey":"XXX","deviceid":"YYY"}')
      }));
      return internet.postKeys({ clienttoken: 'client token 1' }).then((key) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'https://api.getirkit.com/1/keys');
        assert(args[1].method === 'POST');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert(args[1].body === JSON.stringify({ clienttoken: 'client token 1' }));
        assert(key.clientkey === 'XXX');
        assert(key.deviceid === 'YYY');
      });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture(before, (_) => void 0, ({ fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.postKeys({ clienttoken: 'invalid' }).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 401'); // internal api
      });
    })
  )
];

export { tests };
