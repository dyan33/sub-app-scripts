const fs = require('fs');
const axios = require('axios');

exports.random = function (min, max) {
  let num = Math.random() * (max - min) + min;
  if (num == min || num == max) {
    num = random(min, max);
  }
  return num;
};

exports.info = function () {
  const args = process.argv.splice(2);

  const lang = args[0];
  const timezone = args[1];
  const proxy = args[2];
  const deviceid = args[3];

  return {
    lang,
    timezone,
    proxy,
    deviceid
  };
};

exports.saveFile = function (path, content) {
  fs.writeFile(path, content, (err) => console.log(err))
}