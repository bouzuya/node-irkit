# node-irkit

A [IRKit](http://getirkit.com/) Device / Internet HTTP API wrapper for Node.js.

## Installation

```
npm install @bouzuya/irkit
```

## Usage

```typescript
import { IRKitDevice, Message, Security } from '@bouzuya/irkit';

const main = async () => {
  // options.ip or `process.env.IRKIT_DEVICE_IP`
  const device = new IRKitDevice({ ip: '192.168.1.1' });

  // IRKitDevice.prototype.getMessages()
  // GET /messages
  const message: Message = await device.getMessages();
  if (message !== null) {
    // {"format":"raw","freq":38,"data":[18031, ...]}
    console.log(message);
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
  // {"clienttoken":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
  console.log(keys);

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

## APIs

### IRKit Device HTTP API

- GET /messages
- POST /messages
- POST /keys
- POST /wifi

### IRKit Internet HTTP API

- TODO: POST /1/keys
- TODO: POST /1/messages
- TODO: GET /1/messages
- TODO: POST /1/clients
- TODO: POST /1/devices
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
