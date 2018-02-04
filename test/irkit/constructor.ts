import { Test, test } from 'beater';
import assert from 'power-assert';
import { IRKit } from '../../src/irkit';

const category = '/irkit (constructor) ';
const tests: Test[] = [
  test(category, () => {
    assert(new IRKit());
  })
];

export { tests };
