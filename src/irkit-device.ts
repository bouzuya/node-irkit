import { fetch } from './_';
import {
  Security,
  SerializeOptions,
  serialize
} from './irkit-device-key-serializer';

export interface Key {
  clienttoken: string;
}

export interface Message {
  data: number[];
  format: 'raw';
  freq: 38 | 40; // kHz
}

export type WifiOptions = SerializeOptions;

export { Security };

export class IRKitDevice {
  private deviceIp: string;

  constructor(options?: Partial<{ deviceIp: string; }>) {
    const deviceIpOrUndefined: string | undefined =
      typeof options === 'undefined' ||
        typeof options.deviceIp === 'undefined'
        ? process.env.IRKIT_DEVICE_IP // | undefined
        : options.deviceIp;
    if (typeof deviceIpOrUndefined === 'undefined') {
      throw new Error('ip is not defined');
    }
    this.deviceIp = deviceIpOrUndefined;
  }

  public getDeviceIp(): string {
    return this.deviceIp;
  }

  public getMessages(): Promise<Message | null> {
    return this.fetch('GET', '/messages');
  }

  public postKeys(): Promise<Key> {
    return this.fetch('POST', '/keys');
  }

  public postMessages(message: Message): Promise<void> {
    return this.fetch('POST', '/messages', JSON.stringify(message));
  }

  public postWifi(wifi: WifiOptions): Promise<void> {
    return this.fetch('POST', '/wifi', serialize(wifi));
  }

  private fetch<T>(method: string, path: string, body?: string): Promise<T> {
    const url = 'http://' + this.deviceIp + path;
    return fetch(url, {
      ...(method === 'GET' ? {} : { body }),
      headers: {
        'Accept': 'text/plain', // text/plain only
        'Content-Type': 'text/plain'
      },
      method
    })
      .then((response) => {
        return response.status === 200
          ? response.text().then((text) => text.length === 0 ? null : JSON.parse(text))
          : Promise.reject(new Error(`status: ${response.status}`));
      });
  }
}
