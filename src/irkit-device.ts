import { fetch } from './_';

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
    const method = 'GET';
    const path = '/messages';
    const url = 'http://' + this.deviceIp + path;
    return fetch(url, {
      headers: {
        Accept: 'text/plain' // text/plain only
      },
      method
    })
      .then((response) => {
        return response.status === 200
          ? response.text().then((text) => text.length === 0 ? null : JSON.parse(text))
          : Promise.reject(new Error(`status: ${response.status}`));
      });
  }

  public postMessages(message: Message): Promise<void> {
    const method = 'POST';
    const path = '/messages';
    const url = 'http://' + this.deviceIp + path;
    return fetch(url, {
      body: JSON.stringify(message),
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
