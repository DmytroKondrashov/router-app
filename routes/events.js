const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const validateEventsMiddleware = require('../middleware/validateEventsMiddleware')
const axios = require('axios');

// Sample destinations config
const destinationsConfig = {
  strategy: 'ALL', // Default routing strategy
  destinations: [
    {
      name: 'destination1',
      transport: 'http.post',
      url: 'http://localhost:3000/destinations/destination1',
    },
    {
      name: 'destination2',
      transport: 'http.get',
      url: 'http://localhost:3000/destinations/destination2',
    },
    {
      name: 'destination3',
      transport: 'console.log'
    },
    {
      name: 'destination4',
      transport: 'console.warn'
    },
  ]
};

// Send events to destinations
async function sendEvents(payload, destinationsSelectedForRouting) {
  const destinationsList =  destinationsConfig.destinations;
  const result = {};

  for (const [key, value] of Object.entries(destinationsSelectedForRouting)) {
    const destination = destinationsList.find(destination => destination.name === key);

    if (value && destination.transport === 'http.post') {
      try {
        await axios.post(destination.url, payload);
        result[key] = true;
      } catch (error) {
        result[key] = false;
      }

    } else if (value && destination.transport === 'http.get') {
      try {
        await axios.get(destination.url, payload);
      result[key] = true;
      } catch (error) {
        result[key] = false;
      }

    } else if (value && destination.transport === 'http.put') {
      try {
        await axios.put(destination.url, payload);
      result[key] = true;
      } catch (error) {
        result[key] = false;
      }

    } else if (value && destination.transport === 'http.delete') {
      try {
        await axios.delete(destination.url, payload);
      result[key] = true;
      } catch (error) {
        result[key] = false;
      }

    } else if (value && destination.transport === 'console.log') {
      console.log(`Logging for ${destination.name}, event data: ${JSON.stringify(payload, null, 2)}`);
      result[key] = true;

    } else if (value && destination.transport === 'console.warn') {
      console.warn(`Warning for ${destination.name}, event data: ${JSON.stringify(payload, null, 2)}`);
      result[key] = true;

    } else if (!value) {
      result[key] = false;
    }
  }

  return result;
}

// Get a ist of unique destinations from the request
function getUniqueDestinations(possibleDestinations) {
  const uniqueDestinations = [];

  possibleDestinations.forEach((destination) => {
    Object.entries(destination).forEach(([key, value]) => {
      const existingKey = uniqueDestinations.find((pair) => Object.keys(pair)[0] === key);

      if (!existingKey ) {
        uniqueDestinations.push({ [key]: [value] });
      } else {
        const element = uniqueDestinations.find(obj => key in obj);
        element[key].push(value);
      }
    });
  });

  return uniqueDestinations;
}

// Parse custom strategy from string to function
function parseStrategyFunctionString(routingStrategy) {
  const match = routingStrategy.match(/^function\s*\(([^)]*)\)\s*{\s*([\s\S]*)\s*}$/);

  if (!match) {
    throw new Error('Invalid function string');
  }

  const args = match[1].split(',').map(arg => arg.trim());

  if (args.length !== 1) {
    throw new Error('Please provide a function with exactly one argument');
  }

  const body = match[2].trim();

  return new Function(args, body);
}

// Define if a sequest should be routed to specific destination
function selectDestinationsForRouting(uniqueDestinations, routingStrategy) {
  const destinationsForRouting = {};

  switch (routingStrategy) {
    case "ALL":
      uniqueDestinations.forEach((destination) => {
        Object.entries(destination).forEach(([key, value]) => {
          let falseIntents = 0;
          value.forEach(el => {
            if (el == false) {
              falseIntents += 1;
            }
          })
          if (falseIntents === 0 && !destinationsForRouting[key]) {
            destinationsForRouting[key] = true;
          }
          if (falseIntents > 0 && !destinationsForRouting[key]) {
            destinationsForRouting[key] = false;
          }
        });
      });
      return destinationsForRouting;
    
    case "ANY":
      uniqueDestinations.forEach((destination) => {
        let trueIntents = 0;
        Object.entries(destination).forEach(([key, value]) => {
          value.forEach(el => {
            if (el == true) {
              trueIntents += 1;
            }
          })
          if (trueIntents > 0 && !destinationsForRouting[key]) {
            destinationsForRouting[key] = true;
          }
          if (trueIntents < 1 && !destinationsForRouting[key]) {
            destinationsForRouting[key] = false;
          }
        });
      });
      return destinationsForRouting;

    default:
      const strategyFunction = parseStrategyFunctionString(routingStrategy);
      const strategyFunctionResult = strategyFunction();
      if (strategyFunctionResult != true && strategyFunctionResult != false) {
        throw new Error('Please provide a function that retrurns a boolean value');
      }
      uniqueDestinations.forEach((obj) => {
        const key = Object.keys(obj)[0];
        if (!destinationsForRouting[key]) {
          destinationsForRouting[key] = strategyFunctionResult;
        }
      })
      return destinationsForRouting;
  }
}

// Route for sending the event request to
router.post('/', verifyToken, validateEventsMiddleware, async (req, res) => {
  const payload = req.body.payload;
  const routingStrategy = req.body.strategy || destinationsConfig.strategy;
  const possibleDestinations = req.body.possibleDestinations;

  const uniqueDestinations = getUniqueDestinations(possibleDestinations);
  const destinationsSelectedForRouting = selectDestinationsForRouting(uniqueDestinations, routingStrategy);
  const result = await sendEvents(payload, destinationsSelectedForRouting);

  res.status(200).json(result);
});

module.exports = router;