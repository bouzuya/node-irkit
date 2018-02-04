// tslint:disable
// POST /keys      ... IN: (none)              OUT: clienttoken
// POST /1/keys    ... IN: clienttoken         OUT: clientkey, deviceid
// POST /1/door    ... IN: clientkey, deviceid OUT: hostname

import {
  IRKit,
  IRKitDevice
} from '../src'; // @bouzuya/irkit

const main = async () => {
  const deviceIp: string | undefined = process.env.IRKIT_DEVICE_IP;

  if (typeof deviceIp === 'undefined') {
    console.log('IRKIT_DEVICE_IP is not defined. Try the following commands.');
    console.log('$ dns-sd -B _irkit._tcp');
    console.log('$ dns-sd -G v4 "${IRKIT_HOSTNAME}".local');
    throw new Error('IRKIT_DEVICE_IP is not defined');
  }

  const device = new IRKitDevice({ deviceIp });
  const internet = new IRKit();
  const { clienttoken } = await device.postKeys();
  console.log(`clienttoken: ${clienttoken}`);
  const { clientkey, deviceid } =
    await internet.postKeys({ clienttoken }); // optional: clientkey
  console.log(`clientkey: ${clientkey} / deviceid: ${deviceid}`);
  const door = await internet.postDoor({ clientkey, deviceid });
  if (door !== null) {
    console.log('OK');
    console.log(`Your IRKit hostname: ${door.hostname}`);
  } else {
    console.log('Timeout');
  }
};

// try {
//   main();
// } catch (e) {
//   console.error(e);
// }

export { main };
