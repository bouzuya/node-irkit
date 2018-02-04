// tslint:disable
// 1. POST /1/clients ... IN: (none)              OUT: clientkey
// 2. POST /1/devices ... IN: clientkey           OUT: devicekey, deviceid
// 3. POST /wifi      ... IN: devicekey, wifi     OUT: (none)
// 4. POST /1/door    ... IN: clientkey, deviceid OUT: hostname

import {
  IRKit,
  IRKitDevice,
  Security
} from '../src'; // @bouzuya/irkit

const main = async () => {
  const apikey: string | undefined = process.env.IRKIT_API_KEY;
  const deviceIp: string | undefined = process.env.IRKIT_DEVICE_IP;
  const email: string | undefined = process.env.IRKIT_EMAIL;
  const password: string | undefined = process.env.IRKIT_WIFI_PASSWORD;
  const ssid: string | undefined = process.env.IRKIT_WIFI_SSID;

  const internet = new IRKit();
  if (typeof apikey === 'undefined') {
    if (typeof email === 'undefined') {
      throw new Error('IRKIT_API_KEY and IRKIT_EMAIL are not defined');
    } else {
      const { message } = await internet.postApps({ email });
      console.log(message);
      return;
    }
  }

  if (typeof deviceIp === 'undefined') {
    console.log('IRKIT_DEVICE_IP is not defined. Try the following commands.');
    console.log('$ dns-sd -B _irkit._tcp');
    console.log('$ dns-sd -G v4 "${IRKIT_HOSTNAME}".local');
    throw new Error('IRKIT_DEVICE_IP is not defined');
  }
  if (typeof password === 'undefined') {
    throw new Error('IRKIT_WIFI_PASSWORD is not defined');
  }
  if (typeof ssid === 'undefined') {
    throw new Error('IRKIT_WIFI_SSID is not defined');
  }

  const { clientkey } = await internet.postClients({ apikey });
  console.log(`clientkey: ${clientkey}`);
  const { deviceid, devicekey } = await internet.postDevices({ clientkey });
  console.log(`deviceid: ${deviceid} / devicekey: ${devicekey}`);
  const device = new IRKitDevice({ deviceIp });
  await device.postWifi({
    devicekey,
    password,
    security: Security.WPA_WPA2,
    ssid
  });
  const door = await internet.postDoor({ clientkey, deviceid });
  if (door !== null) {
    console.log('OK');
    console.log(`Your IRKit hostname: ${door.hostname}`);
  } else {
    console.log('Timeout');
  }
};

try {
  main();
} catch (e) {
  console.error(e);
}
