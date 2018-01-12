const Base = require('./base.js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports = class extends Base {
  // 反射型XSS
  index7Action() {
    // http://127.0.0.1:8360/xss/index7?name=%3Cscript%3Econsole.log(123)%3C/script%3E
    this.assign('name', this.get('name') || 666);

    // http://127.0.0.1:8360/xss/index7?id=123);console.log(23
    this.assign('id', this.get('id') || 666);
    return this.display();
  }

  // DOM-XSS
  index8Action() {
    return this.display();
  }

  // 存储型XSS
  index9Action() {
    return this.display();
  }

  // html
  index1Action() {
    this.assign('a', `<script>console.log('XSS攻击=>aaa');</script>`);
    this.assign('b', `<script>console.log('通过编码解决XSS');</script>`);
    return this.display();
  }

  // adance html
  index1_1Action() {
    return this.display();
  }

  // attribute
  index2Action() {
    this.assign('a', `a" onclick="console.log('XSS攻击=>aaa');`);
    this.assign('b', `a" onclick="console.log('通过编码解决XSS');`);

    this.assign('c1', `console.log(123);`);
    // this.assign('c2', `console.log&#x28;123&#x29;&#x3b;`);

    this.assign('d1', `javascript:console.log(456)`);
    // this.assign('d2', `javascript&#x3a;console.log&#x28;456&#x29;&#x3b;`);
    this.assign('d3', `javascript:console.log(789)`);
    return this.display();
  }

  // javascript
  index3Action() {
    // event
    this.assign('a',`click')" onmouseover="console.log('XSS攻击=>aaa');"`);
    this.assign('b',`click')" onmouseover="console.log('通过编码解决XSS');"`);

    // js
    this.assign('c', `ccc1'); console.log('XSS攻击=>ccc`);
    this.assign('d', `ccc2'); console.log('通过编码解决XSS`);
    this.assign('e', `console.log('setTimeout直接使用字符串，即使编码也是无效的')`);
    return this.display();
  }

  // URL
  index4Action() {
    this.assign('a', ` " onclick="alert(123)"`);
    this.assign('b', ` " onclick="alert(456)"`);
    return this.display();
  }

  // CSS
  index5Action() {
    this.assign('a', `javascript:alert('XSS');`);
    this.assign('b', `expression(alert(/xss/)`);
    return this.display();
  }

  // httponly
  index6Action() {
    this.cookie('name', 'thinkjs', {httpOnly: true});
    return this.display();
  }

  readLineAction() {
    const rd = readline.createInterface({
      input: fs.createReadStream(path.join(think.ROOT_PATH, 'src/config/vectors.txt')),
      output: process.stdout,
      console: false
    });

    rd.on('line', function(line) {
      // console.log(line);
    });
  }
};
