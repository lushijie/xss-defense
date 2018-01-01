const Base = require('./base.js');

module.exports = class extends Base {
  htmlAction() {
    this.assign('a', `<script>console.log('aaa');</script>`);
    this.assign('b', `<script>console.log('bbb);</script>`);
    return this.display('basic/index_html');
  }

  attributeAction() {
    this.assign('a', `" onclick="console.log(123);`);
    this.assign('b', `" onclick="console.log(456);`);

    // encode console.log(789);
    this.assign('c', `console.log&#x28;789&#x29;&#x3b;`);

    // encode javascript:console.log(666);
    this.assign('d', `javascript&#x3a;console.log&#x28;666&#x29;&#x3b;`);
    return this.display('basic/index_attibute');

  }

  javascriptAction() {
    this.assign('a',`click')" onmouseover="console.log('mouseover');"`);
    this.assign('b',`click')" onmouseover="console.log('mouseover');"`);

    this.assign('c', `ccc1"); console.log("ccc2`);
    this.assign('d', `ccc1"); console.log("ccc2`);
    this.assign('e', `console.log('setTimeout')`);
    return this.display('basic/index_javascript');
  }

  urlAction() {
    this.assign('a', ` " onclick="alert(1)"`);
    this.assign('b', ` " onclick="alert(1)"`);
    this.assign('c', ` http://china.huanqiu.com/article/2017-12/11487461.html?from= " onclick="alert(1)"`);
    return this.display('basic/index_url');
  }

  cssAction() {
    this.assign('a', `javascript:alert('XSS');`);
    this.assign('b', `expression(alert(/xss/)`);
    return this.display('basic/index_css');
  }

  httponlyAction() {
    this.cookie('abc', 'test');
    return this.display('advance/index_httponly');
  }

  filterhtmlAction() {
    return this.display('advance/index_filterhtml');
  }

  index8Action() {
    this.assign('a', '安');
    this.assign('b', `java&#115;cript:alert(1)`);
    return this.display();
  }

  index9Action() {
    return this.display();
  }
};
