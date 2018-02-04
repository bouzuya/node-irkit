import { Test } from 'beater';
import { tests as constructorTests } from './constructor';
import { tests as postKeysTests } from './post-keys';
import { tests as postMessagesTests } from './post-messages';

const tests: Test[] = ([] as Test[])
  .concat(constructorTests)
  .concat(postKeysTests)
  .concat(postMessagesTests);

export { tests };
