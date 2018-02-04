// Original Source Code: http://jsdo.it/mash/keyserializer-test
// MIT License

// CRC-8-Dallas/Maxim

type U8 = number; // 0 <= x <= 255 (0x00 <= x <= 0xFF)

export interface SerializeOptions {
  devicekey: string;
  password: string;
  security: Security;
  ssid: string;
}

// tslint:disable:no-bitwise
function crc8n(u8: U8, crcinit: number): U8 {
  if (u8 < 0x00 || u8 > 0xFF) {
    throw new Error('only input less than 1byte as number');
  }
  let crc = crcinit ^ u8;
  for (let i = 0; i < 8; i++) {
    const poly = (crc & 0x80) === 0x80;
    crc = (crc << 1) ^ (poly ? 0x31 : 0x00); // 0x31 = X^8+X^5+X^4+X^0
  }
  return crc & 0xFF;
}
// tslint:enable

function crc8s(data: string, size: number, crcinit: number): number {
  let crc = crcinit;
  for (let i = 0; i < size; i++) {
    const u8 = i < data.length ? data.charCodeAt(i) : 0x00; // 0 filled
    crc = crc8n(u8, crc);
  }
  return crc;
}

function hex(s: string): string {
  let ret = '';
  for (let i = 0; i < s.length; i++) {
    ret += s.charCodeAt(i).toString(16).toUpperCase();
  }
  return ret;
}

function serializeSecurity(security: Security): string {
  return security.toString();
}

function serializeSSID(ssid: string): string {
  return hex(ssid);
}

function serializePassword(password: string): string {
  return hex(password);
}

function serializeWEPPassword(password: string): string {
  return serializePassword(hex(password));
}

function serializeDevicekey(devicekey: string): string {
  return devicekey;
}

enum Security {
  NONE = 0,
  WEP = 2,
  WPA_WPA2 = 8
}

function serializeCRC(obj: SerializeOptions): string {
  let crc = 0x00;
  crc = crc8n(obj.security, crc);
  crc = crc8s(obj.ssid, 33, crc);
  crc = crc8s(obj.password, 64, crc);
  crc = crc8n(1, crc); // wifi_is_set
  crc = crc8n(0, crc); // wifi_was_valid
  crc = crc8s(obj.devicekey, 33, crc);
  return crc.toString(16).toUpperCase();
}

function serialize({
  devicekey,
  password,
  security,
  ssid
}: SerializeOptions): string {
  return [
    serializeSecurity(security),
    serializeSSID(ssid),
    security === Security.WEP
      ? serializeWEPPassword(password)
      : serializePassword(password),
    serializeDevicekey(devicekey),
    '2', // 2: TELEC, 1: FCC, 0: ETSI
    '',
    '',
    '',
    '',
    '',
    serializeCRC({
      devicekey,
      password,
      security,
      ssid
    })
  ].join('/');
}

export {
  Security,
  serialize
};
