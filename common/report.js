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

  r(level, tag,message) {
    const url = `http://52.53.238.169:8081/app/log?name=${this.name}`;

    const data=JSON.parse(meta.replace(/\n/g,""))
    data.level=level;
    data.tag=tag;
    data.info=message;
    data.date=new Date().toISOString();

    axios
      .post(url, data)
      .then(response => {})
      .catch(error => {
        if (error) {
          console.log(error);
        }
      });
  }

  i(tag,message){this.r(INFO,tag,message)}
  w(tag,message){this.r(WARNING,tag,message)}
  s(tag,message){this.r(SUCCESS,tag,message)}
  e(tag,message){this.r(ERROR,tag,message)}


}

module.exports = {
  ERROR,
  WARNING,
  INFO,
  SUCCESS,
  Report,
};
