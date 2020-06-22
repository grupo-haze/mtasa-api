const MtaSA = require('../../dist')

const mtaAPI = new MtaSA.api()

// en-US: If set debug true, the steps are shown
// pt-BR: Se você colocar debug como true, os passos vão ser mostrados

mtaAPI.debug = true

// en-US: You should build before use the API
// pt-BR: Você precisa dar build antes de usar a API

mtaAPI.build()
  .then(() => {
    const alanticServer = mtaAPI.getBy({ ip: '149.56.228.58', port: 22003 })
    console.log(alanticServer)
  })

//
// const example = async () => {
//   await mtaAPI.build()
//
//   const alanticServer = mtaAPI.getBy({ ip: '149.56.228.58', port: 22003 })
//   console.log(alanticServer)
// }
//
// example()
//

// en-US: If you don't build before using it, you will launch a new Error
// pt-BR: Se você não der build antes de usar, vai lançar um novo Erro

//
// const otherMtaAPI = new MtaAPI()
//
// otherMtaAPI.getBy({
//   ip: '149.56.228.58'
// })
//
