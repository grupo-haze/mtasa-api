import { IMTAServerInfo } from './MTAServerInfo';

export type SearchFunction = (data: IMTAServerInfo, objectKey: keyof IMTAServerInfo, objectValue: any) => boolean;
