import { Test, test } from 'beater';
import assert from 'power-assert';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { IRKit as IRKit_ } from '../../src/irkit';
import { fixture } from '../_';

interface Context {
  email: string;
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
    email: 'mail@example.com',
    fetch,
    internet
  });
};

const category = '/irkit (postApps) ';
const tests: Test[] = [
  test(
    category,
    fixture({ before }, ({
      email,
      fetch,
      internet
    }) => {
      fetch.returns(Promise.resolve({
        status: 200,
        text: () => Promise.resolve('{"message":"foo"}')
      }));
      return internet.postApps({ email })
        .then(({ message }) => {
          assert(fetch.callCount === 1);
          const args = fetch.getCall(0).args;
          assert(args.length === 2);
          assert(args[0] === 'https://api.getirkit.com/1/apps');
          assert(args[1].method === 'POST');
          assert(args[1].headers['Content-Type'] === 'application/json');
          assert(args[1].body === JSON.stringify({ email }));
          assert(message);
        });
    })
  ),
  test(
    category + 'HTTP 401',
    fixture({ before }, ({ email, fetch, internet }) => {
      fetch.returns(Promise.resolve({
        status: 401
      }));
      return internet.postApps({ email })
        .then(() => {
          assert.fail();
        }, (e) => {
          assert(e.message === 'status: 401'); // internal api
        });
    })
  )
];

export { tests };
