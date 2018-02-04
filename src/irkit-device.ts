import { fetch } from './_';

export interface Key {
  clienttoken: string;
}

export interface Message {
  data: number[];
  format: 'raw';
  freq: 38 | 40; // kHz
}

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
    return this.fetch('POST', '/messages', message);
  }

  private fetch<T>(method: string, path: string, body?: any): Promise<T> {
    const url = 'http://' + this.deviceIp + path;
    return fetch(url, {
      ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
      headers: {
        'Accept': 'text/plain', // text/plain only
        'Content-Type': 'application/json'
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
