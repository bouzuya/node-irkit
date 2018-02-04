// tslint:disable
import { main as setupDeviceConnedted } from './setup-device-connected';
import { main as setupDeviceDisconnedted } from './setup-device-disconnected';

const main = async () => {
  const command = process.argv[2];
  switch (command) {
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
