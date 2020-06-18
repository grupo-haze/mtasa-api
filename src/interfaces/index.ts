interface IMTAError {
  message: string,
  type: string
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
  IMTAServerInfo,
  IMTAError
}
