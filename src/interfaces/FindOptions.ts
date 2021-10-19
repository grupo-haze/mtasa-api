import { IMTAServerInfo } from './MTAServerInfo';

export interface IMTAGetBy {
  ip: string,
  port?: number
}

export type IMTASearchBy = {
  [K in keyof IMTAServerInfo]?: IMTAServerInfo[K];
}
