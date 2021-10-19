import { IMTAServerInfo } from './MTAServerInfo';
export interface MTAStorage {
    write(data: IMTAServerInfo[]): Promise<void>;
    get(): Promise<IMTAServerInfo[]>;
}
