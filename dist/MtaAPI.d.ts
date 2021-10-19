import { IMTAError, IMTAGetBy, IMTASearchBy, IMTAServerInfo } from './interfaces';
import { MTAStorage } from './interfaces/MTAStorage';
import { APIRequest } from './APIRequest';
export declare class MtaAPI {
    private readonly storage;
    private readonly request;
    private readonly log;
    private delayTime;
    private lastRequestTime;
    private interval;
    private searchFunction;
    debug: boolean;
    error: IMTAError | undefined;
    constructor(storage?: MTAStorage, request?: APIRequest);
    getAll(): Promise<IMTAServerInfo[]>;
    getBy(opts?: IMTAGetBy): Promise<IMTAServerInfo[] | undefined>;
    search(by: IMTASearchBy): Promise<IMTAServerInfo[] | undefined>;
    update(): Promise<void>;
    stop(): void;
    setDelay({ seconds }: {
        seconds: number;
    }): this;
    lastRequest(): Date;
    private start;
    private createData;
    private useDebug;
    private buildServerInfo;
    private serverName;
}
