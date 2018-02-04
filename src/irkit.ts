import { fetch } from './_';

export interface Key {
  clientkey: string;
  deviceid: string;
}

export interface Message {
  data: number[];
  format: 'raw';
  freq: 38 | 40; // kHz
}

export class IRKit {
  public postKeys(
    options: { clientkey?: string; clienttoken: string; }
  ): Promise<Key> {
    return this.fetch('POST', '/1/keys', options);
  }

  public postMessages(
    { clientkey, deviceid, message }: { clientkey: string; deviceid: string; message: Message; }
  ): Promise<void> {
    return this.fetch('POST', '/1/messages', {
      clientkey,
      deviceid,
      message: JSON.stringify(message)
    });
  }

  private fetch<T>(method: string, path: string, body?: any): Promise<T> {
    const url = 'https://api.getirkit.com' + path;
    return fetch(url, {
      ...(method === 'GET' ? {} : { body: JSON.stringify(body) }),
      headers: {
        'Accept': 'application/json',
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
