"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MtaAPI_1 = require("../MtaAPI");
// en-US: If set debug true, the steps are shown
// pt-BR: Se você colocar debug como true, os passos vão ser mostrados
async function example() {
    const api = new MtaAPI_1.MtaAPI();
    const brasilGamingRealista = await api.getBy({ ip: '51.222.149.10', port: 22003 });
    console.log('example server:', brasilGamingRealista);
}
example();
