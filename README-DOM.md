# 基于DOM的XSS预防手册

## 1. 引言

在说到XSS时，有三种公认的XSS形式：反射型、存储型和基于DOM的XSS。[XSS防御手册](***)在反射型与存储型XSS防御方面做了出色的工作。本文主要介绍基于DOM的XSS防御，是对[XSS防御手册](***)的扩展与补充。

为了理解基于DOM的XSS，需要了解其与反射型、存储型XSS的根本区别：攻击被注入的位置不同。反射型与存储型XSS是服务端注入，而基于DOM的XSS是客户端（浏览器）注入。所有的这些代码都来源于服务器，这意味着不论XSS属于什么类型，应用程序的所有者都有责任使其不受XSS攻击。此外，XSS的攻击总是在浏览器执行的。基于DOM的XSS与反射型/存储型XSS的区别是攻击者添加或者注入到应用程序的位置不同：反射型/存储型XSS是在处理服务端请求时被注入到应用程序中的，此时不可信数据被动态加到HTML中；基于DOM的XSS是在客户端运行时直接注入到应用程序中的。

当浏览器渲染HTML或者其他像CSS、JavaScript等相关内容的时候，它会为不同类型的输入标识各种渲染上下文，每个上下文有不同的渲染规则。渲染上下文与解析HTML标签及其属性相关联。渲染上下文的HTML解析器指示数据如何在页面上呈现，并且可以进一步拆分为HTML、HTML 属性、URL、CSS的标准上下文。执行上下文的JavaScript或VBScript解析器与解析和执行脚本代码相关联。每个解析器具有不同的和独立的语义，在语义下可能执行脚本这使得创建一致的规则来解决各种上下文中的漏洞变得困难。

就本文而言，我们将HTML，HTML属性，URL和CSS上下文称为子上下文，因为可以在JavaScript执行上下文中访问和设置每个上下文。在JavaScript代码中，主要上下文是JavaScript，但是使用特定的标记和上下文关闭字符，攻击者可以尝试使用等效的JavaScript DOM方法攻击其他4个上下文。

以下是JavaScript上下文和HTML子上下文中发生的漏洞示例：
```js
<script>
  var x = '<%= taintedVar %>';
  var d = document.createElement('div');
  d.innerHTML = x;
  document.body.appendChild(d);
</script>
```

让我们依次看看执行上下文的各个子上下文。

### 规则1-在执行上下文中，将不可信数据插入HTML子上下文之前，先进行HTML转义然后JavaScript转义


有几种方法和属性可以用来直接在JavaScript中呈现HTML内容。这些方法构成执行上下文中的HTML子上下文。如果这些方法提供了不可信的输入，则可能导致XSS漏洞。例如：

危险HTML方法示例：

属性:

```js
  element.innerHTML = "<HTML> Tags and markup";
  element.outerHTML = "<HTML> Tags and markup";
```

方法:

```js
  document.write("<HTML> Tags and markup");
  document.writeln("<HTML> Tags and markup");
```

规避指南：

要安全地动态更新DOM中的HTML，我们推荐a）HTML编码，然后b）对所有不可信输入进行JavaScript编码，如以下示例所示：

```js
  element.innerHTML = "<%=Encoder.encodeForJS(Encoder.encodeForHTML(untrustedData))%>";
  element.outerHTML = "<%=Encoder.encodeForJS(Encoder.encodeForHTML(untrustedData))%>";

  document.write("<%=Encoder.encodeForJS(Encoder.encodeForHTML(untrustedData))%>");
  document.writeln("<%=Encoder.encodeForJS(Encoder.encodeForHTML(untrustedData))%>");
```


### 规则2-在执行上下文中，将不可信数据插入的HTML属性子上下文之前进行JavaScript转义

例如，一般的规则将来自数据库、HTTP请求、用户、后端系统等的不可信数据进行HTML属性编码。在渲染上下文输出数据的时候这样做是没有问题的，但是在执行上下文使用HTML属性编码将会破坏应用程序要显示的数据。

安全但是破坏性的示例：

```js
var x = document.createElement("input");
x.setAttribute("name", "company_name");
// companyName代表不可信输入
// Encoder.encodeForHTMLAttr()是不需要的，这样会导致重复转义问题
x.setAttribute("value", '<%=Encoder.encodeForJS(Encoder.encodeForHTMLAttr(companyName))%>');
var form1 = document.forms[0];
form1.appendChild(x);
```

问题在于如果componyName为“Johnson & Johnson”，按照此方法将会显示为“Johnson &amp; Johnson”。这里正确的编码方案应该只进行JavaScript编码，禁止攻击者关闭单引号和内嵌代码，或者转义为HTML并开一个新的script标记。


安全并正确的示例：

```js
var x = document.createElement("input");
x.setAttribute("name", "company_name");
x.setAttribute("value", '<%=Encoder.encodeForJS(companyName)%>');
var form1 = document.forms[0];
form1.appendChild(x);
```

值的注意的是，当设置一个不执行代码的HTML属性时，该值直接在HTML元素的object属性上设置，所以不用担心注入。

### 规则3-在执行上下文中，将不可信数据插入事件处理程序或者JavaScript代码子上下文时要小心

将动态数据放在JavaScript代码中是特别危险的，因为与其他编码相比，JavaScript编码对JavaScript编码数据具有不同的语义。在很多情况下，JavaScript编码不会阻止执行上下文中的攻击。例如，即便是JavaScript编码后的字符串也会执行。

因此，主要的建议是避免在这种情况下包含不可信的数据。如果必须的这么干的话，下面的例子描述了一些可行和不可行的方法。

```js
var x = document.createElement("a");
x.href="#";
// 即使JavaScript编码了还是可以执行
x.setAttribute("onclick", "\u0061\u006c\u0065\u0072\u0074\u0028\u0032\u0032\u0029");
var y = document.createTextNode("Click To Test");
x.appendChild(y);
document.body.appendChild(x);
```

 setAttribute(name_string,value_string) 方法是危险的，因为它隐式地将value_string强制转换为name_string的DOM属性数据类型。在上面的例子中，属性名称是一个JavaScript的事件处理程序，因此该属性值被隐式地转化为JavaScript代码并执行。对于上面的情况，JavaScript编码不会减轻基于DOM的XSS。其他将字符串视为代码类型JavaScript方法具有类似的问题（setTimeout，setInterval，new Function等）。这与对HTML标签（HTML解析器）的事件处理程序属性使用JavaScript编码解决XSS形成鲜明对比。

```
// 点击onclick不工作
<a id="bb" href="#" onclick="\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029"> Test Me</a>
```

 Element.setAttribute(…)设置DOM属性的替代方案是直接设置属性。直接设置事件处理程序属性那么JavaScript编码将能够缓解基于DOM的XSS。请注意，将不可信数据直接放入命令执行上下文始终是危险的设计。

```
<a id="bb" href="#"> Test Me</a>
```

```js
//The following does NOT work because the event handler is being set to a string.  "alert(7)" is JavaScript encoded.
document.getElementById("bb").onclick = "\u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0029";

//The following does NOT work because the event handler is being set to a string.
document.getElementById("bb").onmouseover = "testIt";

//The following does NOT work because of the encoded "(" and ")". "alert(77)" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0061\u006c\u0065\u0072\u0074\u0028\u0037\u0037\u0029;

//The following does NOT work because of the encoded ";". "testIt;testIt" is JavaScript encoded.
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074\u003b\u0074\u0065\u0073\u0074\u0049\u0074;

//The following DOES WORK because the encoded value is a valid variable name or function reference.  "testIt" is JavaScript encoded
document.getElementById("bb").onmouseover = \u0074\u0065\u0073\u0074\u0049\u0074;

function testIt() {
   alert("I was called.");
}
```

JavaScript中还有其他地方可以将JavaScript编码接受为有效的可执行代码。

```js
for ( var \u0062=0; \u0062 < 10; \u0062++){
    \u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
    .\u0077\u0072\u0069\u0074\u0065\u006c\u006e
    ("\u0048\u0065\u006c\u006c\u006f\u0020\u0057\u006f\u0072\u006c\u0064");
}
\u0077\u0069\u006e\u0064\u006f\u0077
.\u0065\u0076\u0061\u006c
\u0064\u006f\u0063\u0075\u006d\u0065\u006e\u0074
.\u0077\u0072\u0069\u0074\u0065(111111111);
```

或者

```js
var s = "\u0065\u0076\u0061\u006c";
var t = "\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0031\u0029";
window[s](t);
```

由于JavaScript基于国际标准（ECMAScript）,JavaScript中的变量和字符除了字符串表示法，还支持字符串转义表示法。

然而HTML编码的情况恰恰相反，HTML标签元素定义明确，不支持同一标签的替代表示。因此，HTML编码不能用于让开发人员对a标签进行替代表示。

### 规则4-在执行上下文中，将不可信数据插入到的CSS属性子上下文之前进行JavaScript转义

通常在一个CSS上下文执行JavaScript需要给CSS的url()使用 `javascript:攻击代码`，或者调用 expression() 方法直接传入JavaScript代码来执行。据我所知，expression() 函数已经被禁止了。为了解决CSS url()的XSS问题，需要保证传递给url() 的是URL编码之后的数据。

```js
document.body.style.backgroundImage = "url(<%=Encoder.encodeForJS(Encoder.encodeForURL(companyName))%>)";
```

### 规则5-在执行上下文中，将不可信数据插入URL属性时，要将不可信数据先进行URL编码然后JavaScript编码

解析执行和渲染上下文中的URL的逻辑看起来是相同的。因此，执行上下文中的URL属性的编码规则几乎没有变化

```js
var x = document.createElement("a");
x.setAttribute("href", '<%=Encoder.encodeForJS(Encoder.encodeForURL(userRelativePath))%>');
var y = document.createTextElement("Click Me To Test");
x.appendChild(y);
document.body.appendChild(x);
```
如果使用完整的URL，那么这里链接将会被破坏，因为协议标识符（“http：”或“javascript：”）中的冒号将被URL编码，从而阻止调用“http”和“javascript”协议


### 规则6-使用安全的JavaScript函数或属性填充DOM

将不可信数据填充DOM的最基本的安全方法是使用安全赋值属性textContent。这是一个安全使用的例子。

```js
<script>
  element.textContent = untrustedData;  //does not execute code
</script>
```

### 规则7-修复DOM跨站点脚本漏洞

修复基于DOM的XSS的最好方法是使用正确的输出方法。例如，如果要使用用户输入写入div标记元素，请不要使用innerHtml，而应使用innerText/textContent，这将解决问题，并且这也是解决基于DOM的XSS漏洞的正确方法。

在eval等危险源中使用用户输入是一个糟糕的主意，99％的情况表明这是一个不好或懒惰的编程习惯，所以干脆不要这样做，而不是试图过滤输入。

最后为了解决我们最初代码中的问题，采用的不是对输出的数据进行麻烦的编码，而是直接使用element.textContent来完成。

```js
<b>Current URL:</b> <span id="contentholder"></span>
.....
<script>
  document.getElementById("contentholder").textContent = document.baseURI;
</script>
```
它做同样的事情，但是这一次它不容易受基于DOM的XSS漏洞影响。


## JavaScript开发安全应用程序指南

基于DOM的XSS由于其攻击面大，浏览器缺乏标准化，因此非常难以减轻攻击。以下指南旨在为开发人员在开发基于Web的JavaScript应用程序（Web 2.0）时提供指导，以避免XSS。

### 指导规则1-不受信任的数据只能被视为可显示的文本

避免将不可信的数据视为JavaScript代码中的代码或标记。

### 指导规则2-在构建模板化Javascript时，将不可信的数据进行JavaScript编码和并用引号包裹起来

```js
var x = "<%= Encode.forJavaScript(untrustedData) %>";
```

### 指导规则3-使用document.createElement(‘’), element.setAttribute(‘’, ‘value’), element.appendChild() 等类似的动态构建接口

请注意，element.setAtrribute 只对有限数量的属性是安全的。危险的属性包括任何属于命令执行上下文的属性，例如 onclick 或者 onblur。安全的属性包括：align，alink，alt，bgcolor，border，cellpadding，cellspacing，class，colours，cols，colspan，coords，dir，face，height，hspace，ismap，lang，marginheight，marginwidth，multiple，nohref，noresize ，noshade，nowrap，ref，rel，rev，rows，rowspan，scrolling，shape，span，summary，tabindex，title，usemap，valign，value，vlink，vspace，width。

### 指导规则4—避免将不可信数据给HTML渲染方法使用

避免对下列方法使用不可信数据：

```js
element.innerHTML = "...";
element.outerHTML = "...";
document.write(...);
document.writeln(...);
```

### 指导规则5-避免对不可信数据隐式执行eval操作的方法





### 指导规则6-不可信数据的使用限制在操作符右侧

将不可信数据限制到操作符右侧是一个优秀的设计，同时还要注意那些传递给类似location，eval的的数据。

```js
// 不要
window[userData] = "moreUserData";
// 而要
if (userData==="location") {
   window.location = "static/path/or/properly/url/encoded/value";
}
```

### 指导规则7-当DOM中的URL编码要注意字符集问题

如果JavaScript DOM中字符集没有明确定义，在DOM中URL编码的时候要注意字符集编码的问题。


###
