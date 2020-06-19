import path from 'path'
import fs from 'fs'
import axios from 'axios'
import {IMTAError, IMTAServerInfo} from './interfaces'
import {type} from "os";

class MtaAPI {
  private ip: string = ''
  private data: Array<IMTAServerInfo> | undefined
  private requestStartsIn: number = 0
  private requestEndsIn: number = 0
  private waitTime: number = 30
  private lastTime: number = 0
  private interval: any = false
  private baseDir: string = path.resolve(__dirname)
  private selfData: Array<IMTAServerInfo> = []
  private builded: boolean = false

  public debug: boolean = true
  public error: IMTAError | undefined
  public apiURL: string = 'https://mtasa.com/api/'

  public build (): void {
    if (!this.builded) {
      this.startTick()
      this.builded = true
    }
  }

  public isBuilded (): boolean {
    return this.builded
  }

  public time2Seconds (time: number): number {
    return time / 1000
  }

  public seconds2Time (seconds: number): number {
    return seconds * 1000
  }

  private requestAll (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestStartsIn = Date.now()
      this.useDebug('Requesting all...')

      axios.get(this.apiURL)
        .then(response => {
          const { data } = response
          this.useDebug('Request all ends')

          this.requestEndsIn = Date.now()
          this.useDebug(`Request time: ${this.time2Seconds(this.lastRequestTime())}`)

          resolve(this.buildServerInfo(data))
        })
        .catch(e => {
          reject(this.buildError(e))
        })
    })
  }

  private startTick (): void {
    if (this.interval) {
      clearInterval(this.interval)
    }

    this.buildData()
      .then(() => {
        this.interval = setInterval(async () => { await this.buildData() }, this.seconds2Time(this.waitTime))
        this.useDebug(`Tick started with ${this.waitTime} seconds`)
      })
      .catch(e => {
        throw new Error(e)
      })
  }

  private async buildData () {
    try {
      await this.requestAll()
      if (this.existsJSON()) {
        await this.readJSON()

        if (this.checkToGenerateNewJSON()) {
          this.writeJSON(this.data)
        }
      } else {
        this.writeJSON(this.data)
      }
    } catch (e) {
      return e
    }
  }

  /**
   * Returns time in seconds
   * @return number
   */
  public lastRequestTime (): number {
    return ((this.requestEndsIn - this.requestStartsIn)) || 0
  }

  private checkToGenerateNewJSON () {
    const time = Date.now() - this.lastTime
    this.useDebug(`JSON file was generated at ${this.time2Seconds(time)} seconds ago`)

    return this.time2Seconds(time) >= this.waitTime
  }

  private writeJSON(data: Array<IMTAServerInfo> | undefined) {
    if (!data) {
      return false
    }
    try {
      this.useDebug('Starting to write JSON')
      const toWrite = JSON.stringify({
        time: Date.now(),
        data: data
      })

      fs.writeFile(path.resolve(this.baseDir, 'servers.json'), toWrite, err => {
        if (err) {
          this.buildError(err)
          this.useDebug("Can't write servers.json file")
        } else {
          this.useDebug('servers.json writed')
        }
      })

    } catch (e) {
      this.buildError(e)

      return false
    }
  }

  private readJSON () {
    return new Promise((resolve, reject) => {
      this.useDebug('Starting to read JSON File')
      const stream = fs.readFile(path.resolve(path.resolve(this.baseDir, 'servers.json')), 'utf-8', (err, data) => {
        if (err) {
          this.buildError(err)
          reject(err)
        } else {
          try {
            const tempData = JSON.parse(data)
            this.useDebug('JSON File readed')

            this.data = tempData.data
            this.lastTime = tempData.time
            resolve()
          } catch (e) {
            this.writeJSON(this.data)
            this.buildError(e)
            reject(e)
          }
        }
      })
    })
  }

  private existsJSON (): boolean {
    return fs.existsSync(path.resolve(this.baseDir, 'servers.json'))
  }

  private useDebug (data: any) {
    if (this.debug) {
      console.log((new Date()).toLocaleDateString(), data)
    }
  }

  private buildServerInfo (data: Array<any>) : Array<IMTAServerInfo> {
    const temp: Array<IMTAServerInfo> = []
    this.useDebug('Starting loop to mount IMTAServerInfo')
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

    this.useDebug('Loop ends')
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

  private setWaitTime (seconds: number) {
    this.waitTime = this.seconds2Time(seconds)
  }
}

export default MtaAPI

const mta = new MtaAPI()

mta.build()
