import { Test, test } from 'beater';
import assert from 'power-assert';
import { IRKitMessage } from '../src/irkit-message';

const category = '/irkit-message ';
const tests: Test[] = [
  test(category, () => {
    const message: IRKitMessage = {
      data: [],
      format: 'raw',
      freq: 38
    };
    assert(message);
  })
];

export { tests };
