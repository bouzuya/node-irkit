import { Test } from 'beater';
import { tests as constructorTests } from './constructor';
import { tests as postKeysTests } from './post-keys';

const tests: Test[] = ([] as Test[])
  .concat(constructorTests)
  .concat(postKeysTests);

export { tests };
