"use strict";
var MtaAPI = require('../../dist');
var mtaAPI = new MtaAPI();
mtaAPI.build()
    .then(function () {
    console.log(mtaAPI.getBy({
        ip: '212.3.135.77', port: 22003
    }));
});
