/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:13
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-31 19:36:15
*/
const fileSession = require('think-session-file');
const cookieSession = require('think-session-cookie');
const path = require('path');

module.exports = {
  type: 'cookie',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['lushijie1218'],
      signed: true
    }
  },
  cookie: {
    handle: cookieSession,
    cookie: {
      maxAge: 24 * 3600 * 1000,
      keys: ['lushijie', 'lushijie1218'],
      encrypt: true,
      httpOnly: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
