const Base = require('./base.js');

module.exports = class extends Base {

  // html
  index1Action() {
    this.assign('a', `<script>console.log('XSS注入输出');</script>`);
    this.assign('b', `<script>console.log('bbb);</script>`);
    return this.display('basic/index_index1');
  }

  // attribute
  index2Action() {
    this.assign('a', `a" onclick="console.log(123);`);
    this.assign('b', `a" onclick="console.log(456);`);

    this.assign('c1', `console.log(789);`);
    this.assign('c2', `console.log&#x28;789&#x29;&#x3b;`);

    this.assign('d1', `javascript:console.log(666)`);
    this.assign('d2', `javascript&#x3a;console.log&#x28;666&#x29;&#x3b;`);
    this.assign('d3', `javascript:console.log(666)`);
    return this.display('basic/index_index2');
  }

  // javascript
  index3Action() {
    // event
    this.assign('a',`click')" onmouseover="console.log('mouseover a');"`);
    this.assign('b',`click')" onmouseover="console.log('mouseover');"`);

    // js
    this.assign('c', `ccc1'); console.log('XSS攻击`);
    this.assign('d', `ccc2'); console.log('通过JavaScript编码解决XSS`);
    this.assign('e', `console.log('setTimeout直接使用字符串，这种即使编码也是无效的')`);
    return this.display('basic/index_index3');
  }

  // URL
  index4Action() {
    this.assign('a', ` " onclick="alert(1)"`);
    this.assign('b', ` " onclick="alert(1)"`);
    this.assign('c', ` http://china.huanqiu.com/article/2017-12/11487461.html?from= " onclick="alert(1)"`);
    return this.display('basic/index_index4');
  }

  // CSS
  index5Action() {
    this.assign('a', `javascript:alert('XSS');`);
    this.assign('b', `expression(alert(/xss/)`);
    return this.display('basic/index_index5');
  }



  // 反射型XSS
  index11Action() {
    // http://127.0.0.1:8360/index/index11?name=%3Cscript%3Econsole.log(123)%3C/script%3E
    this.assign('name', this.get('name') || '空');

    // http://127.0.0.1:8360/index/index11?id=123);console.log(23
    this.assign('id', this.get('id') || '空');
    return this.display();
  }

  // 存储型XSS
  //
  //
  // DOM-based XSS
  index12Action() {
    return this.display();
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
    this.assign('a', `<div style="color: #f00" onclick="console.log(123);">
      Hello
    </div>`);
    return this.display();
  }

  index10Action() {
    console.log(this.get('name'));
    return this.display();
  }



  index13Action() {
    this.assign('a', `<div style="color: #f00" onclick="console.log(123);">
      Hello
    </div>`);
    return this.display();
  }

  index14Action() {
    this.assign('a', `<div style="color: #f00" onclick="console.log(123);">
      Hello
    </div>`);
    return this.display();
  }

  index15Action() {
    this.assign('a', `<div style="color: #f00" onclick="console.log(123);">
      Hello
    </div>`);
    return this.display();
  }
};
