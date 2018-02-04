// tslint:disable
import fs from 'fs';
import {
  IRKit,
  IRKitMessage
} from '../src'; // @bouzuya/irkit

const loadMessage = (name: string): IRKitMessage => {
  const data = fs.readFileSync(
    './example/message/' + name + '.json',
    { encoding: 'utf-8' }
  );
  return JSON.parse(data);
};

const main = async () => {
  const clientkey: string | undefined = process.env.IRKIT_CLIENT_KEY;
  const deviceid: string | undefined = process.env.IRKIT_DEVICE_ID;

  if (typeof clientkey === 'undefined') {
    throw new Error('IRKIT_CLIENT_KEY is not defined');
  }

  if (typeof deviceid === 'undefined') {
    throw new Error('IRKIT_DEVICE_ID is not defined');
  }

  const internet = new IRKit();
  const message = loadMessage('light');
  await internet.postMessages({
    clientkey,
    deviceid,
    message
  });
};

// try {
//   main();
// } catch (e) {
//   console.error(e);
// }

export { main };
