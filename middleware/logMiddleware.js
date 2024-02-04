const Log = require('../models/log');

const logMiddleware = async (req, res, next) => {
  const log = new Log({
    method: req.method,
    path: req.path,
    request: {
      headers: req.headers,
      body: req.body,
    },
  });

  try {
    const originalSend = res.send;
    res.send = function (body) {
      log.response = {
        statusCode: res.statusCode,
        body,
      };

      log.save();

      res.send = originalSend;

      originalSend.apply(res, arguments);
    };

    next();
  } catch (error) {
    console.error('Error in logMiddleware:', error);
    next();
  }
};

module.exports = logMiddleware;
