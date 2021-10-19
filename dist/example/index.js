"use strict";
const { MtaAPI } = require('../../dist');
const api = new MtaAPI();

api.getBy({ ip: '51.222.149.10', port: 22003 })
    .then((brasilGamingRealista) => {
        console.log('example server:', brasilGamingRealista);
    });
