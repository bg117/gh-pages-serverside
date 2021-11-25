const express = require('express');
const app = express();

module.exports = [
  function(req, res, next) {
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Expose-Headers', '*')
    next();
  },
  express.static(__dirname + "/public")
]