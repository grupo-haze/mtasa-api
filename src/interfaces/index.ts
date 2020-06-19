interface IMTAError {
  message: string,
  type: string
}

interface IMTAGetBy {
  ip: string,
  port?: number
}

interface IMTAServerInfo {
  name: string,
  ip: string,
  maxplayers: number,
  keep: boolean,
  players: number,
  version: string,
  requirePassword: boolean,
  port: number
}

export {
  IMTAGetBy,
  IMTAServerInfo,
  IMTAError
}
