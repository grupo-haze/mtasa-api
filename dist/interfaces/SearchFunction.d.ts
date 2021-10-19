import { IMTAServerInfo } from './MTAServerInfo';
export declare type SearchFunction = (data: IMTAServerInfo, objectKey: keyof IMTAServerInfo, objectValue: any) => boolean;
