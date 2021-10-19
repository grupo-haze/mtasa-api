import debug from 'debug';
import { ms } from 'ms-converter';
import { IMTAError, IMTAGetBy, IMTASearchBy, IMTAServerInfo, SearchFunction } from './interfaces';
import { MemoryStorage } from './storage';
import { MTAStorage } from './interfaces/MTAStorage';
import { APIRequest } from './APIRequest';
import { OfflineAPIException } from './errors';

export class MtaAPI {
  private readonly log = debug(MtaAPI.name);

  private delayTime = ms(30, 'seconds');
  private lastRequestTime = 0;
  private interval: any = false

  private searchFunction: SearchFunction = (data, objectKey, objectValue) =>
    data[objectKey].toString().toLowerCase().includes(objectValue.toString().toLowerCase())

  public debug = false
  public error: IMTAError | undefined

  constructor (
    private readonly storage: MTAStorage = new MemoryStorage(),
    private readonly request = new APIRequest(),
  ) {}

  // Get all data
  // PS: if instance is stoped, back to update
  public async getAll() {
    await this.start();
    return this.storage.get();
  }

  public async getBy(opts: IMTAGetBy = { ip: '', port: 0 }): Promise<IMTAServerInfo[] | undefined> {
    return (await this.getAll()).filter((server) => {
      if (!opts.port) {
        return server.ip === opts.ip
      }

      return server.ip === opts.ip && server.port === opts.port
    })
  }

  public async search (by: IMTASearchBy): Promise<IMTAServerInfo[] | undefined> {
    const keys: (keyof IMTAServerInfo)[] = Object.keys(by) as (keyof IMTAServerInfo)[];

    const data = await this.getAll();

    return data.filter((server) => keys.map((key) => this.searchFunction(server, key, by[key])));
  }

  // Stop getting update data
  public stop(): void {
    clearInterval(this.interval);
  }

  // Delay time to update new data
  public setDelay ({ seconds }: { seconds: number }): this {
    this.useDebug(`In the next tick 'waitTime' will be updated to ${seconds} seconds`)
    this.delayTime = ms(seconds, 'seconds');

    return this;
  }

  // Time of last request executed
  public lastRequest(): Date {
    return new Date(this.lastRequestTime);
  }

  private async start (): Promise<void> {
    const log = this.log.extend(this.start.name);

    return new Promise((resolve) => {
      log('has interval', !!this.interval);

      if (!this.interval) {
        log('creating new interval');
        this.interval = setInterval(() => this.intervalFn(log), this.delayTime)

        log('requesting initial data...');
        this.intervalFn(log)
          .then(resolve);
      } else {
        resolve();
      }
    })
  }

  private async intervalFn(log: debug.Debugger) {
    log('requesting api...');

    const apiData = await this.request.find();

    log('request ends');

    try {
      const data = this.buildServerInfo(apiData);

      log('setting data');

      await this.storage.write(data);

      this.lastRequestTime = Date.now();
    } catch (e) {
      if (e instanceof OfflineAPIException) {
        this.log('API Offline !')

        const currentData = await this.storage.get();

        if (!currentData || !Array.isArray(currentData)) {
          this.log('writing empty data...')
          await this.storage.write([]);
        }
      }
    }
  }

  private useDebug (data: any) {
    if (this.debug) {
      // tslint:disable-next-line:no-console
      console.log((new Date()).toLocaleDateString(), data)
    }
  }

  private buildServerInfo(data: any[]) : IMTAServerInfo[] {
    this.useDebug('Starting loop to mount IMTAServerInfo')

    const builded: IMTAServerInfo[] = data.map((value) => {
      const dt: IMTAServerInfo = {
        name: value.name.toString('utf16le') ,
        ip: value.ip || '',
        maxplayers: value.maxplayers || 0,
        keep: value.keep === 1,
        playersCount: value.players || 0,
        version: value.version || '',
        requirePassword: value.password === 1,
        port: value.port || ''
      }

      return dt;
    })

    this.useDebug('Loop ends')

    return builded;
  }
}
