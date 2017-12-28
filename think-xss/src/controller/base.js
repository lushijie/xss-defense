module.exports = class extends think.Controller {
  __before() {

  }

  encodeForHTML(string) {
    var htmlEscapeMap = {
      '&': '&amp;',  // & in escaped code
      '<': '&lt;',   // DEC=> &#60; HEX=> &#x3c; Entity=> &lt;
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;', // &apos; 不推荐，因为它不在HTML规范中
      '/': '&#x2F;'  // 闭合标签
    };
    var htmlEscapeChars = /[&<>"'\/]/g;
    return ('' + string).replace(htmlEscapeChars, function(match) {
      return htmlEscapeMap[match];
    });
  }
};
