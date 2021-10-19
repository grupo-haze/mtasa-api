import { MTAStorage } from '../interfaces/MTAStorage';
import { IMTAServerInfo } from '../interfaces';

export class MemoryStorage implements MTAStorage {
  private _data: IMTAServerInfo[] = [];

  get(): Promise<IMTAServerInfo[]> {
    return Promise.resolve(this._data);
  }

  write(data: IMTAServerInfo[]): Promise<void> {
    if (!data) {
      return Promise.reject('Invalid data to write');
    }

    this._data = data;

    return Promise.resolve();
  }

}
