const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org?format=json', (error, response, ip) => {
   
    if (error) {
      callback(error, null);
    
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${ip}`;
      callback(Error(msg), null);
      return;
    }

    const ipParse = JSON.parse(ip);
    callback(null, ipParse);
  });

};

const fetchCoordsByIP = function(ipParse, callback) {

  const url = 'https://freegeoip.app/json/';

  request(url, (error, response, coords) => {
  
    if (error) {
      callback(error, null);
  
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${coords}`;
      callback(Error(msg), null);
      return;
    }
    const coordsObject = JSON.parse(coords);
    callback(null, coordsObject);
  });

};

const fetchISSFlyOverTimes = function(coordsObject, callback) {

  const url = `http://api.open-notify.org/iss-pass.json?lat=${coordsObject.latitude}&lon=${coordsObject.latitude}`;

  request(url, (error, response, riseTime) => {
  
    if (error) {
      callback(error, null);
  
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${riseTime}`;
      callback(Error(msg), null);
      return;
    }


    const riseTimeParse = JSON.parse(riseTime);
    callback(null,riseTimeParse['response']);
  });

};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ipParse) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ipParse, (error, coordsObject) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordsObject, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP , fetchCoordsByIP , fetchISSFlyOverTimes , nextISSTimesForMyLocation};