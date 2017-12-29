/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:20
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-29 09:38:19
*/
const mysql = require('think-model-mysql');
const isDev = think.env === 'development';

module.exports = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: '',
    prefix: 'think_',
    encoding: 'utf8',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: 'root',
    dateStrings: true
  }
}
