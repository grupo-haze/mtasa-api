# MTA:SA API

> Get information from your MTA:SA server easily and quickly.

## Install MTA:SA API

To install MTA:SA API, follow these steps:

npm
```
npm install mtasa-api
```

yarn
```
yarn add mtasa-api
```

## Functions

- getAll
- getBy({ ip: string, port?: number } )
- search({ name?: string, ip?: number, version?: string })
- setDelay({ seconds: number })


### Example

```js
import { MtaAPI } from 'mtasa-api'

const example = async () => {
   const api = new MtaAPI();

   const brasilGamingRealista = await api.getBy({ ip: '51.222.149.10', port: 22003 });
   console.log('example server:', brasilGamingRealista);
}

example()
```
   
