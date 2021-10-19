import axios, { AxiosInstance } from 'axios';
import parse from 'parse-json';
import { MTARawData } from './interfaces';
import { ms } from 'ms-converter';
import debug from 'debug';
import { MtaAPI } from './MtaAPI';
import { InvalidAPIResponseException, OfflineAPIException } from './errors';

export class APIRequest {
  private readonly log = debug(MtaAPI.name).extend(APIRequest.name);

  public readonly url = 'https://mtasa.com/api'

  private readonly instance: AxiosInstance;

  private timeout = ms(6, 'seconds');

  constructor(instance?: AxiosInstance) {
    this.instance = instance || axios.create({
      baseURL: this.url,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  async find(): Promise<MTARawData[]> {
    this.log('requesting data')
    const request = await this.instance.get<MTARawData[]>('/');

    let data = request.data;
    if (typeof request.data === 'string') {
      try {
        data = parse(request.data);
      } catch (e) {
        throw new InvalidAPIResponseException(request.data, e as Error);
      }
    }

    this.log('response : ', request.data?.length);

    if (!data || !data?.length) {
      throw new OfflineAPIException();
    }

    return data;
  }

  public setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }
}
