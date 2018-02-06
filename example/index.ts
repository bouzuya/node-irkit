// tslint:disable
import { main as postMessage } from './post-message';
import { main as setupDeviceConnedted } from './setup-device-connected';
import { main as setupDeviceDisconnedted } from './setup-device-disconnected';

const main = async () => {
  const command = process.argv[2];
  const arg = process.argv[3];
  switch (command) {
    case 'post-message':
      return postMessage(arg);
    case 'setup-device-connected':
      return setupDeviceDisconnedted();
    case 'setup-device-disconnected':
      return setupDeviceConnedted();
    default:
      console.log([
        '',
        'Usage:',
        '',
        '    node .tmp/es5/example/index.js <command>',
        '',
        'Commands:',
        '',
        '    post-message',
        '    setup-device-connected',
        '    setup-device-disconnected',
        ''
      ].join('\n'));
      throw new Error(`unknown command: ${command}.`);
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
