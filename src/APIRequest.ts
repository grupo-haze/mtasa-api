import axios, { AxiosInstance } from 'axios';
import { IMTAServerInfo } from './interfaces';
import { ms } from 'ms-converter';
import debug from 'debug';
import { MtaAPI } from './MtaAPI';
import { OfflineAPIException } from './errors';

export class APIRequest {
  private readonly log = debug(MtaAPI.name).extend(APIRequest.name);

  public readonly url = 'https://mtasa.com/api'

  private readonly instance: AxiosInstance;

  private timeout = ms(6, 'seconds');

  constructor(instance?: AxiosInstance) {
    this.instance = instance || axios.create({
      baseURL: this.url,
      timeout: this.timeout
    });
  }

  async find() {
    this.log('requesting data')
    const { data } = await this.instance.get<IMTAServerInfo[]>('/');

    this.log('response : ', data?.length);

    if (!data || !data?.toString().trim()) {
      throw new OfflineAPIException();
    }

    return data;
  }

  public setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }
}
