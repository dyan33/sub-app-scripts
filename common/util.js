const fs = require("fs");
const path = require("path");

exports.random = function(min, max) {
  let num = Math.random() * (max - min) + min;
  if (num == min || num == max) {
    num = random(min, max);
  }
  return num;
};

exports.info = function() {
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

exports.saveFile = function(filePath, content) {
  let dirname = path.dirname(filePath);

  mkdirs(dirname, () => {
    fs.writeFile(filePath, content, function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
};
