import { AxiosInstance } from 'axios';
import { MTARawData } from './interfaces';
export declare class APIRequest {
    private readonly log;
    readonly url = "https://mtasa.com/api";
    private readonly instance;
    private timeout;
    constructor(instance?: AxiosInstance);
    find(): Promise<MTARawData[]>;
    setTimeout(timeout: number): this;
}
