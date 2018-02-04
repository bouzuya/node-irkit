import { Test } from 'beater';
import { tests as constructorTests } from './constructor';
import { tests as getMessagesTests } from './get-messages';

const tests: Test[] = ([] as Test[])
  .concat(constructorTests)
  .concat(getMessagesTests);

export { tests };
