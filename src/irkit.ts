import { fetch } from './_';
import { IRKitMessage } from './irkit-message';

export interface Key {
  clientkey: string;
  deviceid: string;
}

const qsStringify = (params: { [k: string]: any; }): string => {
  const qs = Object
    .keys(params)
    .sort()
    .map((k) => [k, params[k]])
    .filter(([_, v]) => typeof v !== 'undefined')
    .map((pair) => pair.map((x) => encodeURIComponent(x)).join('='))
    .join('&');
  return qs.length === 0 ? '' : '?' + qs;
};

export class IRKit {
  public getMessages(
    { clear, clientkey }: {
      clear?: 1;
      clientkey: string;
    }
  ): Promise<{
    deviceid: string;
    hostname: string;
    message: IRKitMessage;
  }> {
    return this.fetch('GET', '/1/messages', {
      clear,
      clientkey
    });
  }

  public postClients(
    options: { apikey: string; }
  ): Promise<{ clientkey: string; }> {
    return this.fetch('POST', '/1/clients', options);
  }

  public postDevices(
    options: { clientkey: string; }
  ): Promise<{ deviceid: string; devicekey: string; }> {
    return this.fetch('POST', '/1/devices', options);
  }

  public postKeys(
    options: { clientkey?: string; clienttoken: string; }
  ): Promise<Key> {
    return this.fetch('POST', '/1/keys', options);
  }

  public postMessages(
    { clientkey, deviceid, message }: {
      clientkey: string;
      deviceid: string;
      message: IRKitMessage;
    }
  ): Promise<void> {
    return this.fetch('POST', '/1/messages', {
      clientkey,
      deviceid,
      message: JSON.stringify(message)
    });
  }

  private fetch<T>(
    method: string,
    path: string,
    params: { [k: string]: any; }
  ): Promise<T> {
    const url = 'https://api.getirkit.com' + path +
      (method === 'GET' ? qsStringify(params) : '');
    return fetch(url, {
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) }),
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
