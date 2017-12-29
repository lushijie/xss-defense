/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:00
* @Last Modified by:   lushijie
* @Last Modified time: 2017-12-29 09:37:28
*/
const nunjucks = require('think-view-nunjucks');
const path = require('path');

module.exports = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks,
    options: {
      noCache: true,
      autoescape: false
    },
    beforeRender: (env, nunjucks, config) => {
      env.addFilter('shorten', function(str, count, kwargs){
        console.log(kwargs);
        // console.log(str);
        return str.slice(0, count || 5);
      });
    }
  }
}
