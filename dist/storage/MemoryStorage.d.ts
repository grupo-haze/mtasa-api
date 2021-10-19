import { MTAStorage } from '../interfaces/MTAStorage';
import { IMTAServerInfo } from '../interfaces';
export declare class MemoryStorage implements MTAStorage {
    private _data;
    get(): Promise<IMTAServerInfo[]>;
    write(data: IMTAServerInfo[]): Promise<void>;
}
