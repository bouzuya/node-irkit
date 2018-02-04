# node-irkit

An [IRKit](http://getirkit.com/) Device / Internet HTTP API wrapper for Node.js.

## Installation

```
npm install @bouzuya/irkit
```

## Usage

### `IRKitDevice` (IRKit Device HTTP API)

```typescript
import { IRKitDevice, Message, Security } from '@bouzuya/irkit';

const main = async () => {
  // options.ip or `process.env.IRKIT_DEVICE_IP`
  const device = new IRKitDevice({ ip: '192.168.1.1' });

  // IRKitDevice.prototype.getMessages()
  // GET /messages
  const message: Message = await device.getMessages();
  if (message !== null) {
    console.log(message);
    // {"format":"raw","freq":38,"data":[18031, ...]}
  }

  // IRKitDevice.prototype.postMessages()
  // POST /messages
  await device.postMessages({
    format: 'raw',
    freq: 38,
    data: [ /* ... */ ]
  });

  // IRKitDevice.prototype.postKeys()
  // POST /keys
  const keys = await device.postKeys();
  console.log(keys);
  // {"clienttoken":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}

  // IRKitDevice.prototype.postWifi()
  // POST /wifi
  await device.postWifi({
    devicekey: /* ... */,
    password: /* ... */,
    security: Security.WPA_WPA2,
    ssid: /* ... */
  });
};

main();
```

### `IRKit` (IRKit Internet HTTP API)

```typescript
import { IRKit, IRKitDevice } from '@bouzuya/irkit';

const main = async () => {
  const device = new IRKitDevice({ ip: '192.168.1.1' });
  const client = new IRKit();

  // IRKit.prototype.postKeys()
  // POST /1/keys
  const { clienttoken } = await device.postKeys();
  const keys = await client.postKeys({ clienttoken });
  console.log(keys);
  // { deviceid: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', clientkey: 'XXXXXXXXXXXXXXXXXXXXXXX' }

  // IRKit.prototype.postMessages()
  // POST /1/messages
  const messages = await client.postMessages({
    clientkey: keys.clientkey,
    deviceid: keys.deviceid,
    message: {
      format: 'raw',
      freq: 38,
      data: [ /* ... */ ]
    }
  });

  // IRKit.prototype.getMessages()
  // GET /1/messages
  const messages = await client.getMessages({
    clientkey: keys.clientkey
  });
  if (messages !== null) {
    console.log(messages);
    // {"message":{"format":"raw","freq":38,"data":[18031,...]},"hostname":"IRKitD2A4","deviceid":"FBEC7F5148274DADB608799D43175FD1"}
  }

  // IRKit.prototype.postClients()
  // POST /1/clients
  const clients = await client.postClients({
    apikey: keys.apikey
  });
  console.log(clients);
  // {"clientkey":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}

  // IRKit.prototype.postDevices()
  // POST /1/devices
  const devices = await client.postDevices({
    clientkey: keys.clientkey
  });
  console.log(devices);
  // {"devicekey":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","deviceid":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
};

main();
```

## APIs

### IRKit Device HTTP API

- GET /messages
- POST /messages
- POST /keys
- POST /wifi

### IRKit Internet HTTP API

- POST /1/keys
- POST /1/messages
- GET /1/messages
- POST /1/clients
- POST /1/devices
- TODO: POST /1/door
- TODO: POST /1/apps

## Badges

[![npm version][npm-badge-url]][npm-url]
[![Travis CI][travisci-badge-url]][travisci-url]

[npm-badge-url]: https://img.shields.io/npm/v/@bouzuya/irkit.svg
[npm-url]: https://www.npmjs.com/package/@bouzuya/irkit
[travisci-badge-url]: https://img.shields.io/travis/bouzuya/node-irkit.svg
[travisci-url]: https://travis-ci.org/bouzuya/node-irkit

## License

### [`src/irkit-device-key-serializer.ts`](src/irkit-device-key-serializer.ts)

MIT [mash](http://jsdo.it/mash/keyserializer-test)

### others

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
