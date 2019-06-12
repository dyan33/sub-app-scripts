const fs = require("fs");
const path = require("path");

function random(min, max) {
  let num = Math.random() * (max - min) + min;
  if (num == min || num == max) {
    num = random(min, max);
  }
  return num;
}

function info() {
  const args = process.argv.splice(2);

  const lang = args[0];
  const timezone = args[1];
  const proxy = args[2];
  const deviceid = args[3];
  const meta = JSON.parse(args[4]);

  return {
    lang,
    timezone,
    proxy,
    deviceid,
    meta
  };
}

function mkdirs(dirpath, callback) {
  fs.exists(dirpath, function(exists) {
    if (exists) {
      callback();
    } else {
      mkdirs(path.dirname(dirpath), function() {
        fs.mkdir(dirpath, callback);
      });
    }
  });
}

function saveFile(filePath, content) {
  let dirname = path.dirname(filePath);

  mkdirs(dirname, () => {
    fs.writeFile(filePath, content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
}

module.exports = {
  random,
  saveFile,
  info
};
