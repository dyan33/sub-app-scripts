const axios = require("axios");
const util = require("./util");

const ERROR = "ERROR";
const WARNING = "WARNING";
const INFO = "INFO";
const SUCCESS = "SUCCESS";

const info = util.info();
const meta = info.meta;

class Report {
  constructor(name) {
    this.name = name;
  }

  r(levle, message) {
    const url = `http://52.53.238.169:8081/app/log?name=${this.name}`;

    const data = Object.assign({}, meta);

    data.level = levle;
    data.info = info || "";
    data.date = new Date().toISOString();

    axios
      .post(url, data)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        if (error) {
          console.log(error);
        }
      });
  }

  i(message){this.r(INFO,message)}
  w(message){this.r(WARNING,message)}
  s(message){this.r(SUCCESS,message)}
  e(message){this.r(ERROR,message)}


}

module.exports = {
  ERROR,
  WARNING,
  INFO,
  SUCCESS,
  Report,
};
