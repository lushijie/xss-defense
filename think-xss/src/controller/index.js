const Base = require('./base.js');

module.exports = class extends Base {
  index1Action() {
    this.assign('a', '<script>console.log(666);</script>');
    this.assign('b', '123123');
    return this.display();
  }

  index2Action() {
    return this.display();
  }

  index3Action() {
    return this.display();
  }

  index4Action() {
    return this.display();
  }

  index5Action() {
    return this.display();
  }

  index6Action() {
    return this.display();
  }

  index7Action() {
    return this.display();
  }

  index8Action() {
    return this.display();
  }

  index9Action() {
    return this.display();
  }
};
