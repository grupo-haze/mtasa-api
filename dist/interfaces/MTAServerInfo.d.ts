export interface IMTAServerInfo {
    name: string;
    ip: string;
    port: number;
    maxPlayers: number;
    keep: boolean;
    playersCount: number;
    version: string;
    requirePassword: boolean;
}
export interface MTARawData {
    name: string;
    ip: string;
    maxplayers: number;
    keep: number;
    players: number;
    version: string;
    password: number;
    port: number;
}
