/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:25
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-29 09:36:12
*/
const fileCache = require('think-cache-file');
const path = require('path');

module.exports = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
}
