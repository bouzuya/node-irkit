import { Test, test } from 'beater';
import { fixture } from 'beater-helpers/fixture';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';

interface Context {
  apikey: string;
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
  return Promise.resolve({
    apikey: 'apikey1',
    clientkey: 'clientkey1',
    fetch,
    internet
  });
};

const category = '/irkit (postClients) ';
const tests: Test[] = [
  test(
    category,
    fixture(before, (_) => void 0, ({
      apikey,
      clientkey,
      fetch,
      internet
    }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve(JSON.stringify({
          clientkey
        }))
      }));
      return internet.postClients({ apikey }).then((m) => {
        assert(fetch.callCount === 1);
        const args = fetch.getCall(0).args;
        assert(args.length === 2);
        assert(args[0] === 'https://api.getirkit.com/1/clients');
        assert(args[1].method === 'POST');
        assert(args[1].headers['Content-Type'] === 'application/json');
        assert(args[1].body === JSON.stringify({ apikey }));
        assert.deepEqual(m, { clientkey });
      });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture(before, (_) => void 0, ({ apikey, fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.postClients({
        apikey
      }).then(() => {
        assert.fail();
      }, (e) => {
        assert(e.message === 'status: 401'); // internal api
      });
    })
  )
];

export { tests };
