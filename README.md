## MTA:SA API
##### The Simplest way to obtain data from MTASA servers.

---

#### Functions

- getAll
- getBy({ ip: string, port?: number } )
- search ({ name?: string, ip?: number, version?: string })
- setTick(seconds: int)

---
### Example

```js
import MtaSA from 'mtasa-api'

const mtaAPI = new MtaSA.api()

const example = async () => {
   await mtaAPI.build() // Build the API first

   const alanticServer = mtaAPI.getBy({ ip: '149.56.228.58', port: 22003 })
   console.log(alanticServer) 
}

 example()
```
   
