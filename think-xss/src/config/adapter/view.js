/*
* @Author: lushijie
* @Date:   2017-12-29 09:34:00
* @Last Modified by:   lushijie
* @Last Modified time: 2018-01-03 16:36:35
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
      env.addFilter('encodeForHTML', function(str, kwargs){
        return ('' + str)
          .replace(/&/g, '&amp;')    // & in escaped code
          .replace(/</g, '&lt;')     // DEC=> &#60; HEX=> &#x3c; Entity=> &lt;
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')   // &apos; 不推荐，因为它不在HTML规范中
          .replace(/\//g, '&#x2F;'); // 闭合标签
      });

      env.addFilter('encodeForJavascriptSimple', function(str, kwargs){
        return ('' + str)
          .replace(/\\/g, '\\\\')
          .replace(/'/g, '\\x27')
          .replace(/"/g, '\\x22')
          .replace(/\//g, '\\/')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r');
      });

      env.addFilter('encodeForJavascript', function(str, kwargs) {
        let encoded = '';
        for(let i = 0; i < str.length; i++) {
          let cc = hex = str[i];
          if (!/[A-Za-z0-9]/.test(str[i]) && str.charCodeAt(i) < 256) {
            hex = '\\x' + cc.charCodeAt().toString(16);
          }
          encoded += hex;
        }
        return encoded;
      });

      env.addFilter('encodeForHTMLAttibuteSimple', function(str, kwargs){
        let encoded = '';
        for(let i = 0; i < str.length; i++) {
          let ch = hex =str[i];
          if (!/[A-Za-z0-9]/.test(str[i]) && str.charCodeAt(i) < 256) {
            hex = '&#x' + ch.charCodeAt(0).toString(16) + ';';
          }
          encoded += hex;
        }
        return encoded;
      });

      env.addFilter('encodeForHTMLAttibute', function(str, attr, kwargs){
        let unsafeKeys = {
          'attr_name' : ['on[a-z]{1,}', 'style', 'href', 'src'],
          'attr_val'  : ['javascript:'],
        };

        let attr_whitelist_classes = {
          'default': [',','.','-','_',' ']
        };

        let attr_whitelist = {
          'width': ['%'],
          'height': ['%']
        };

        for ( let i = 0; i < unsafeKeys['attr_name'].length; i++ ) {
          if ( attr.toLowerCase().match(unsafeKeys['attr_name'][i]) ) {
            console.warn("Unsafe attribute name used: " + attr);
            // throw "Unsafe attribute name used: " + attr;
          }
        }

        for ( let n = 0; n < unsafeKeys['attr_val'].length; n++ ) {
          if ( str.toLowerCase().match(unsafeKeys['attr_val'][n]) ) {
            console.warn("Unsafe attribute value used: " + str);
            // throw "Unsafe attribute value used: " + str;
          }
        }

        let immune;
        immune = attr_whitelist[attr];
        if ( !immune ) immune = attr_whitelist_classes['default'];

        let encoded = '';
        for(let i = 0; i < str.length; i++) {
          let ch = str[i];
          let hex = str[i];
          if (!/[A-Za-z0-9]/.test(str[i]) && str.charCodeAt(i) < 256 && immune.indexOf(ch) === -1) {
            hex = '&#x' + ch.charCodeAt(0).toString(16) + ';';
          }
          encoded += hex;
        }
        return encoded;
      });

      env.addFilter('encodeForURL', function(str, kwargs){
        return encodeURIComponent(str);
      });

      env.addFilter('encodeForCSS', function(attr, str, kwargs){
        let css_whitelist_classes = {
          'default': ['-',' ','%'],
          'color': ['#',' ','(',')'],
          'image': ['(',')',':','/','?','&','-','.','"','=',' ']
        };

        let css_whitelist = {
          'background': ['(',')',':','%','/','?','&','-',' ','.','"','=','#'],
          'background-image': css_whitelist_classes['image'],
          'background-color': css_whitelist_classes['color'],
          'border-color': css_whitelist_classes['color'],
          'border-image': css_whitelist_classes['image'],
          'color': css_whitelist_classes['color'],
          'icon': css_whitelist_classes['image'],
          'list-style-image': css_whitelist_classes['image'],
          'outline-color': css_whitelist_classes['color']
        };

        let unsafeKeys = {
          'css_key'   : ['behavior', '-moz-behavior', '-ms-behavior'],
          'css_val'   : ['expression']
        };

        let immune;
        if ( unsafeKeys['css_key'].indexOf(attr) > -1) {
          throw "Unsafe property name used: " + attr;
        }

        for ( let a=0; a < unsafeKeys['css_val'].length; a++ ) {
          if ( str.toLowerCase().indexOf(unsafeKeys['css_val'][a]) >= 0 ) {
            throw "Unsafe property value used: " + str;
          }
        }

        immune = css_whitelist[attr];
        if ( !immune ) immune = css_whitelist_classes['default'];

        let encoded = '';
        for (let i = 0; i < str.length; i++) {
          let ch = str.charAt(i);
          if (!ch.match(/[a-zA-Z0-9]/) && immune.indexOf(ch) === -1) {
            let hex = str.charCodeAt(i).toString(16);
            let pad = '000000'.substr((hex.length));
            encoded += '\\' + pad + hex;
          } else {
            encoded += ch;
          }
        }
        return encoded;
      });

    }
  }
}
