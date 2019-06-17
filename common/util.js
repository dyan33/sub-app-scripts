const fs = require("fs");
const path = require("path");
const args = process.argv.splice(2);
const info = {
  lang: args[0],
  timezone: args[1],
  proxy: args[2],
  deviceid: args[3],
  meta: args[4],
}

function random(min, max) {
  let num = Math.random() * (max - min) + min;
  if (num == min || num == max) {
    num = random(min, max);
  }
  return num;
}

function mkdirs(dirpath, callback) {
  fs.exists(dirpath, function (exists) {
    if (exists) {
      callback();
    } else {
      mkdirs(path.dirname(dirpath), function () {
        fs.mkdir(dirpath, callback);
      });
    }
  });
}

function saveFile(filePath, content) {
  let dirname = path.dirname(filePath);

  mkdirs(dirname, () => {
    fs.writeFile(filePath, content, function (err) {
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
