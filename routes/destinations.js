var express = require('express');
var router = express.Router();

router.post('/destination1', function(req, res, next) {
  console.log('TRIGGERED /destination1')
  res.status(200).json(true);
});

router.get('/destination2', function(req, res, next) {
  console.log('TRIGGERED /destination2')
  res.status(200).json(true);
});

module.exports = router;
