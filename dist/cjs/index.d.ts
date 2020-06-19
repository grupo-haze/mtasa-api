import { IMTAError, IMTAGetBy, IMTAServerInfo } from "./interfaces";
declare class MtaAPI {
    private ip;
    private data;
    private requestStartsIn;
    private requestEndsIn;
    private waitTime;
    private lastTime;
    private interval;
    private baseDir;
    private builded;
    debug: boolean;
    error: IMTAError | undefined;
    apiURL: string;
    getAll(): IMTAServerInfo[] | undefined;
    getBy(opts?: IMTAGetBy): IMTAServerInfo[] | undefined;
    build(): Promise<void>;
    isBuilded(): boolean;
    time2Seconds(time: number): number;
    seconds2Time(seconds: number): number;
    private requestAll;
    private startTick;
    private buildData;
    /**
     * Returns time in seconds
     * @return number
     */
    lastRequestTime(): number;
    private checkToGenerateNewJSON;
    private writeJSON;
    private readJSON;
    private existsJSON;
    private useDebug;
    private buildServerInfo;
    private buildError;
    setTickTime(seconds: number): void;
}
export default MtaAPI;
