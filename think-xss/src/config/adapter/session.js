/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:13
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-29 09:36:59
*/
const fileSession = require('think-session-file');
const path = require('path');

module.exports = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
}
