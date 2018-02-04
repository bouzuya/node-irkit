# node-irkit

A [IRKit](http://getirkit.com/) Device / Internet HTTP API wrapper for Node.js.

## Installation

```
npm install @bouzuya/irkit
```

## Usage

```
import { IRKitDevice } from '@bouzuya/irkit';

const main = async () => {
  // options.ip or `process.env.IRKIT_DEVICE_IP`
  const device = new IRKitDevice({ ip: '192.168.1.1' });

  // IRKitDevice.prototype.getMessages()
  const message = await device.getMessages();
  if (message !== null) {
    // {"format":"raw","freq":38,"data":[18031, ...]}
    console.log(message);
  }

  // IRKitDevice.prototype.postMessages()
  await device.postMessages({
    format: 'raw',
    freq: 38,
    data: [ /* ... */ ]
  });
};

main();
```

## APIs

### IRKit Device HTTP API

- GET /messages
- POST /messages
- TODO: POST /keys
- TODO: POST /wifi

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

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
