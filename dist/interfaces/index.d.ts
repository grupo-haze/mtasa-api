interface IMTAError {
    message: string;
    type: string;
}
interface IMTAGetBy {
    ip: string;
    port?: number;
}
interface IMTASearchBy {
    name?: string;
    ip?: string;
    port?: number;
    version?: string;
}
interface IMTAServerInfo {
    name: string;
    ip: string;
    maxplayers: number;
    keep: boolean;
    playersCount: number;
    version: string;
    requirePassword: boolean;
    port: number;
}
export { IMTASearchBy, IMTAGetBy, IMTAServerInfo, IMTAError };
