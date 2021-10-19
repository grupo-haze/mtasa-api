import debug from 'debug';
import { ms } from 'ms-converter';
import { IMTAError, IMTAGetBy, IMTASearchBy, IMTAServerInfo, MTARawData, SearchFunction } from './interfaces';
import { MemoryStorage } from './storage';
import { MTAStorage } from './interfaces/MTAStorage';
import { APIRequest } from './APIRequest';
import { InvalidAPIResponseException, OfflineAPIException } from './errors';

export class MtaAPI {
  private readonly log = debug(MtaAPI.name);

  private delayTime = ms(10, 'seconds');
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
  public async getAll(): Promise<IMTAServerInfo[]> {
    this.log('getting all');
    await this.start();

    const data = await this.storage.get();

    this.log('get : ok');

    return data;
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

  public async update(): Promise<void> {
    await this.createData(
      this.log.extend(this.update.name),
    );
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

  private async start(): Promise<void> {
    const log = this.log.extend(this.start.name);

    return new Promise((resolve) => {
      log('has interval', !!this.interval);

      if (!this.interval) {
        log('creating new interval');
        this.interval = setInterval(() => this.createData(log), this.delayTime)

        log('requesting initial data...');
        this.createData(log)
          .then(() => resolve());
      } else {
        resolve();
      }
    })
  }

  private async createData(log: debug.Debugger): Promise<IMTAServerInfo[]> {
    try {
      log('requesting api...');

      const apiData = await this.request.find();

      log('request ends');

      const data = this.buildServerInfo(apiData);

      log('setting data');

      await this.storage.write(data);

      this.lastRequestTime = Date.now();

      return data;
    } catch (error) {
      if (error instanceof OfflineAPIException || error instanceof InvalidAPIResponseException) {
        this.log('API Offline or Invalid !')

        const currentData = await this.storage.get();

        if (!currentData || !Array.isArray(currentData)) {
          this.log('writing empty data...')
          await this.storage.write([]);
        }

        return [];
      }

      throw error;
    }
  }

  private useDebug (data: any) {
    if (this.debug) {
      // tslint:disable-next-line:no-console
      console.log((new Date()).toLocaleDateString(), data)
    }
  }

  private buildServerInfo(data: MTARawData[]) : IMTAServerInfo[] {
    this.useDebug('Starting loop to mount IMTAServerInfo')

    const builded: IMTAServerInfo[] = data.map((raw) => {
      const dt: IMTAServerInfo = {
        name: this.serverName(raw.name),
        ip: raw.ip || '',
        maxPlayers: raw.maxplayers || 0,
        keep: raw.keep === 1,
        playersCount: raw.players || 0,
        version: raw.version || '',
        requirePassword: raw.password === 1,
        port: raw.port || -1
      }

      return dt;
    })

    this.useDebug('Loop ends')

    return builded;
  }

  private serverName(raw: string) {
    const str = Buffer.from(raw).toString('utf8');

    try {
      return decodeURIComponent(escape(str));
    } catch (e) {
      return str;
    }
  }
}
