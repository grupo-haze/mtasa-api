import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'
import {IMTAError, IMTAGetBy, IMTASearchBy, IMTAServerInfo} from "./interfaces"

export default class MtaAPI {
  private data: IMTAServerInfo[] | undefined
  private requestStartsIn: number
  private requestEndsIn: number
  private waitTime: number
  private lastTime: number
  private interval: any = false
  private readonly baseDir: string
  private started: boolean
  private builded: boolean

  public debug: boolean
  public error: IMTAError | undefined
  public apiURL: string

  constructor () {
    this.baseDir = path.resolve(__dirname)
    this.builded = false
    this.started = false
    this.lastTime = 0
    this.waitTime = 30000
    this.requestStartsIn = 0
    this.requestEndsIn = 0
    this.debug = false
    this.apiURL = 'https://mtasa.com/api/'
  }

  public getAll () {
    if (this.builded) {
      return this.data
    }
    throw new Error('You should build first')
  }

  public getBy(opts: IMTAGetBy = { ip: '', port: 0 }) {
    if (this.builded) {
      return this.data?.filter(d => {
        if (!opts.port) {
          return d.ip === opts.ip
        }

        return d.ip === opts.ip && d.port === opts.port
      })
    }

    throw new Error('You should build first')
  }

  public search (by: IMTASearchBy) {
    const byKeys: string[] = Object.keys(by)
    const data: object[] = []

    byKeys.forEach((key: string) => {
      const temp = this.data?.filter(d => {
        // @ts-ignore
        if (d[key]) {
          // @ts-ignore
          return d[key].toLowerCase().includes(by[key].toLowerCase())
        }

        return false
      })

      data.push({
        label: key,
        value: temp
      })
    })

    return data
  }

  public setTick (seconds: number) {
    this.useDebug(`In the next tick 'waitTime' will be updated to ${seconds} seconds`)
    this.waitTime = this.seconds2Time(seconds)
  }

  public async build (): Promise<any> {
    if (!this.started) {
      this.started = true
      await this.startTick();
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

  public lastRequestTime (): number {
    return ((this.requestEndsIn - this.requestStartsIn)) || 0
  }

  private requestAll (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestStartsIn = Date.now()
      this.useDebug('Requesting all...')

      axios.get(this.apiURL)
        .then((response: { data: object[] }) => {
          const { data } = response
          this.useDebug('Request all ends')

          this.requestEndsIn = Date.now()
          this.useDebug(`Request time: ${this.time2Seconds(this.lastRequestTime())}`)
          resolve(this.buildServerInfo(data))
        })
        .catch((e: any) => {
          this.buildError(e)
          reject(e)
        })
    })
  }

  private async startTick () {
    if (this.interval) {
      clearInterval(this.interval)
    }

    try {
      if (!this.existsJSON()) {
        await this.buildData()
        this.builded = true
      } else {
        await this.readJSON()
        this.builded = true
      }

      this.interval = setInterval(async () => { await this.buildData() }, this.waitTime)
      this.useDebug(`Tick started with ${this.time2Seconds(this.waitTime)} seconds`)
    } catch (e) {
      this.buildError(e)
      throw e
    }
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
      throw new Error(e)
    }
  }

  private checkToGenerateNewJSON () {
    const time = Date.now() - this.lastTime
    this.useDebug(`JSON file was generated at ${this.time2Seconds(time)} seconds ago`)

    return this.time2Seconds(time) >= this.waitTime
  }

  private writeJSON(data: IMTAServerInfo[] | undefined) {
    if (!data) {
      return false
    }
    try {
      this.useDebug('Starting to write JSON')
      const toWrite = JSON.stringify({
        time: Date.now(),
        data
      })

      fs.writeFile(path.resolve(this.baseDir, 'servers.json'), toWrite, 'utf8', err => {
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

  private readJSON (): Promise<any> {
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
      // tslint:disable-next-line:no-console
      console.log((new Date()).toLocaleDateString(), data)
    }
  }

  private buildServerInfo (data: any[]) : IMTAServerInfo[] {
    const temp: IMTAServerInfo[] = []
    this.useDebug('Starting loop to mount IMTAServerInfo')
    data.forEach(value => {
      const dt: IMTAServerInfo = {
        name: value.name ,
        ip: value.ip || '',
        maxplayers: value.maxplayers || 0,
        keep: value.keep === 1,
        playersCount: value.players || 0,
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

  private buildError (error: any): boolean {
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
      message,
      type
    }

    return false
  }
}
