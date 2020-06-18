import axios from 'axios'
import {IMTAError, IMTAServerInfo} from './interfaces'

class MtaAPI {
  private ip: string = ''
  private data: Array<IMTAServerInfo> | undefined
  private requestStartsIn: number = 0
  private requestEndsIn: number = 0
  private waitTime: number = 30

  public debug: boolean = true
  public error: IMTAError | undefined
  public apiURL: string = 'https://mtasa.com/api/'

  public async getAll () {
    try {
      this.requestStartsIn = Date.now()
      this.useDebug('Requesting all...')

      const { data } = await axios.get(this.apiURL)
      this.useDebug('Request all ends')

      this.requestEndsIn = Date.now()
      this.useDebug(`Request time: ${this.toSeconds(this.timeToRequest())}`)

      return this.buildServerInfo(data)
    } catch (e) {
      return this.buildError(e)
    }
  }

  /**
   * Returns time in seconds
   * @return number
   */
  public timeToRequest (): number {
    return ((this.requestEndsIn - this.requestStartsIn) / 1000) || 0
  }

  private useDebug (data: any) {
    if (this.debug) {
      console.log((new Date()).toLocaleDateString(), data)
    }
  }
  private toSeconds (time: number) {
    return time / 1000
  }

  private buildServerInfo (data: Array<any>) {
    const temp: Array<IMTAServerInfo> = []
    data.forEach(value => {
      const dt: IMTAServerInfo = {
        name: value.name || '',
        ip: value.ip || '',
        maxplayers: value.maxplayers || 0,
        keep: value.keep === 1,
        players: value.players || 0,
        version: value.version || '',
        requirePassword: value.password === 1,
        port: value.port || ''
      }

      temp.push(dt)
    })
    this.data = temp

    return this.data
  }

  private buildError (error: any): Boolean {
    let type = 'default'
    let message = error.message || ''
    if (error.response) {
      type = 'request'
    }

    if (type === 'request') {
      message = error.response.data.message || error.response.statusText || 'not specified'
    } else {
      message = error.message || 'not specified'
    }

    this.error = {
      message: message,
      type: type
    }

    return false
  }

  setIP (ip: string) {
    this.ip = ip
  }
}

export default MtaAPI

const mta = new MtaAPI()

mta.getAll()
  .then(test =>{
    console.log('teste', test)
    console.log(mta.timeToRequest())
  })
  .catch(e => {
    console.log('erro', e)
  })
