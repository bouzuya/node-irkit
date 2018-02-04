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
}
