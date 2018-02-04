import { Test } from 'beater';
import { tests as constructorTests } from './constructor';
import { tests as getMessagesTests } from './get-messages';
import { tests as postClientsTests } from './post-clients';
import { tests as postKeysTests } from './post-keys';
import { tests as postMessagesTests } from './post-messages';

const tests: Test[] = ([] as Test[])
  .concat(constructorTests)
  .concat(getMessagesTests)
  .concat(postClientsTests)
  .concat(postKeysTests)
  .concat(postMessagesTests);

export { tests };
