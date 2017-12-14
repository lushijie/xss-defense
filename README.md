# XSS防御手册

  * [1 引言](#1-%E5%BC%95%E8%A8%80)
    + [1.1 积极的XSS防御模型](#11-%E7%A7%AF%E6%9E%81%E7%9A%84xss%E9%98%B2%E5%BE%A1%E6%A8%A1%E5%9E%8B)
    + [1.2 为什么不能只对不可信数据进行HTML实体编码？](#12-%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%83%BD%E5%8F%AA%E5%AF%B9%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E8%BF%9B%E8%A1%8Chtml%E5%AE%9E%E4%BD%93%E7%BC%96%E7%A0%81)
    + [1.3 你需要一个安全的编码库](#13-%E4%BD%A0%E9%9C%80%E8%A6%81%E4%B8%80%E4%B8%AA%E5%AE%89%E5%85%A8%E7%9A%84%E7%BC%96%E7%A0%81%E5%BA%93)
  * [2 XSS防御规则](#2-xss%E9%98%B2%E5%BE%A1%E8%A7%84%E5%88%99)
    + [2.1 规则0，除了在允许的位置，绝不能在其他位置插入不可信数据](#21-%E8%A7%84%E5%88%990%E9%99%A4%E4%BA%86%E5%9C%A8%E5%85%81%E8%AE%B8%E7%9A%84%E4%BD%8D%E7%BD%AE%E7%BB%9D%E4%B8%8D%E8%83%BD%E5%9C%A8%E5%85%B6%E4%BB%96%E4%BD%8D%E7%BD%AE%E6%8F%92%E5%85%A5%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE)
    + [2.2 规则1，将不可信数据插入到HTML元素内容之前，进行HTML转义](#22-%E8%A7%84%E5%88%991%E5%B0%86%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5%E5%88%B0html%E5%85%83%E7%B4%A0%E5%86%85%E5%AE%B9%E4%B9%8B%E5%89%8D%E8%BF%9B%E8%A1%8Chtml%E8%BD%AC%E4%B9%89)
    + [2.3 规则2，将不可信数据插入到HTML通用属性之前，进行HTML Attribute转义](#23-%E8%A7%84%E5%88%992%E5%B0%86%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5%E5%88%B0html%E9%80%9A%E7%94%A8%E5%B1%9E%E6%80%A7%E4%B9%8B%E5%89%8D%E8%BF%9B%E8%A1%8Chtml-attribute%E8%BD%AC%E4%B9%89)
    + [2.4 规则3，将不可信数据插入到JavaScript数据值之前，进行JavaScript转义](#24-%E8%A7%84%E5%88%993%E5%B0%86%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5%E5%88%B0javascript%E6%95%B0%E6%8D%AE%E5%80%BC%E4%B9%8B%E5%89%8D%E8%BF%9B%E8%A1%8Cjavascript%E8%BD%AC%E4%B9%89)
    + [2.4.1 规则3.1 在HTML上下文中对JSON值进行HTML转义，并使用JSON.parse读取](#241-%E8%A7%84%E5%88%9931-%E5%9C%A8html%E4%B8%8A%E4%B8%8B%E6%96%87%E4%B8%AD%E5%AF%B9json%E5%80%BC%E8%BF%9B%E8%A1%8Chtml%E8%BD%AC%E4%B9%89%E5%B9%B6%E4%BD%BF%E7%94%A8jsonparse%E8%AF%BB%E5%8F%96)
      - [2.4.1.1 JSON 实体编码](#2411-json-%E5%AE%9E%E4%BD%93%E7%BC%96%E7%A0%81)
      - [2.4.1.2 HTML实体编码](#2412-html%E5%AE%9E%E4%BD%93%E7%BC%96%E7%A0%81)
    + [2.5 规则4，将不可信数据插入到HTML Style属性值之前，进CSS转义并严格验证](#25-%E8%A7%84%E5%88%994%E5%B0%86%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5%E5%88%B0html-style%E5%B1%9E%E6%80%A7%E5%80%BC%E4%B9%8B%E5%89%8D%E8%BF%9Bcss%E8%BD%AC%E4%B9%89%E5%B9%B6%E4%B8%A5%E6%A0%BC%E9%AA%8C%E8%AF%81)
    + [2.6 规则5，将不可信数据插入到HTML URL参数值之前， 进行URL转义](#26-%E8%A7%84%E5%88%995%E5%B0%86%E4%B8%8D%E5%8F%AF%E4%BF%A1%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5%E5%88%B0html-url%E5%8F%82%E6%95%B0%E5%80%BC%E4%B9%8B%E5%89%8D-%E8%BF%9B%E8%A1%8Curl%E8%BD%AC%E4%B9%89)
    + [2.7 规则6，使用专业库来清洗HTML标记](#27-%E8%A7%84%E5%88%996%E4%BD%BF%E7%94%A8%E4%B8%93%E4%B8%9A%E5%BA%93%E6%9D%A5%E6%B8%85%E6%B4%97html%E6%A0%87%E8%AE%B0)
    + [2.8 规则 7，防止 DOM-based XSS](#28-%E8%A7%84%E5%88%99-7%E9%98%B2%E6%AD%A2-dom-based-xss)
    + [2.9 加分规则1，使用HTTPOnly Cookie标记](#29-%E5%8A%A0%E5%88%86%E8%A7%84%E5%88%991%E4%BD%BF%E7%94%A8httponly-cookie%E6%A0%87%E8%AE%B0)
    + [2.10 加分规则2，实施内容安全策略](#210-%E5%8A%A0%E5%88%86%E8%A7%84%E5%88%992%E5%AE%9E%E6%96%BD%E5%86%85%E5%AE%B9%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5)
    + [2.11 加分规则3，使用自动转义模板系统](#211-%E5%8A%A0%E5%88%86%E8%A7%84%E5%88%993%E4%BD%BF%E7%94%A8%E8%87%AA%E5%8A%A8%E8%BD%AC%E4%B9%89%E6%A8%A1%E6%9D%BF%E7%B3%BB%E7%BB%9F)
    + [2.12 加分规则4，使用X-XSS-Protection响应头](#212-%E5%8A%A0%E5%88%86%E8%A7%84%E5%88%994%E4%BD%BF%E7%94%A8x-xss-protection%E5%93%8D%E5%BA%94%E5%A4%B4)
  * [3 XSS 防御规则汇总](#3-xss-%E9%98%B2%E5%BE%A1%E8%A7%84%E5%88%99%E6%B1%87%E6%80%BB)
  * [4 输出编码规则汇总](#4-%E8%BE%93%E5%87%BA%E7%BC%96%E7%A0%81%E8%A7%84%E5%88%99%E6%B1%87%E6%80%BB)

## 1 引言

本文提供了一个简单的正向机制来防御[XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))：恰当地输出转义/编码后的数据。虽然有大量的XSS攻击方式，但是遵循一些简单的规则可以完全抵御这些严重攻击。本文不探讨XSS对技术、业务的影响，只说XSS可以导致攻击者能够获取到操作浏览器的做任何事情的能力。

[反射型和存储型XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)#Stored_and_Reflected_XSS_Attacks)都可以通过在服务端执行适当的验证和转义来规避。[基于DOM的XSS](https://www.owasp.org/index.php/DOM_Based_XSS)可以使用 [基于DOM的XSS预防手册](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet) 一文中描述的子集规则来防御。

有关XSS相关的攻击方法，请参阅[XSS过滤规避手册](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)。在[浏览器安全手册](https://code.google.com/archive/p/browsersec/)可以找到关于浏览器安全和各种浏览器的更多背景。

在阅读本文之前，对[注入理论](https://www.owasp.org/index.php/Injection_Theory)有个基本了解是非常有必要的。

### 1.1 积极的XSS防御模型

本文将HTML页面视为模板，模板中存在插槽（slots），允许开发人员在插槽中插入不可信数据。这些插槽覆盖了开发人员绝大多数放置不可信数据的位置。不允许在插槽外的其他位置放置不可信数据。这是一个白名单模式，只有在白名单之中的才是被允许的。

鉴于浏览器解析HTML的方式，不同类型的插槽具有稍微不同的安全规则。将不可信数据放入到插槽时，需要采取一定的措施来确保数据不会从该插槽中跳到允许执行代码的上下文中。从某种意义上，这种方法将HTML文档视为参数化的数据库查询——数据保存在特定的位置，并通过转义与代码上下文隔离。

本文列出了安全地将不可信数据放入常见插槽的规则。基于大量的规则、已知的XSS攻击方法和大量先进浏览器的测试，我们可以保证这里提到的这些规则是安全的。

我们指定了插槽位置并对每个插槽提供了几个例子。为了确保安全，开发人员不应该在没有仔细分析的情况下就将不可信数据放入到其它插槽位置。浏览器解析是非常棘手的，许多看起来无害的字符可能在特定的上下文中起非常重要的作用。

### 1.2 为什么不能只对不可信数据进行HTML实体编码？

HTML实体编码用来编码放置在HTML标签中的不可信数据是可以的，例如\<div>标记内。**对于使用引号包裹的属性，使用HTML实体编码不可信数据也是可行的。** 但是，如果你将不可信的数据放置到\<script>标记的任何位置、onmouseover事件处理程序、CSS内部或者URL中，那么HTML实体编码就不起作用了，这时即便你到处使用HTML实体编码仍然可能遭受XSS攻击。你必须对不同HTML文档部分放置的不可信数据，使用特定编码语法进行处理，这也是我们下面所要讲的。

 ### 1.3 你需要一个安全的编码库

编写这些编码器并不是非常困难，但是也有不少隐藏的陷阱。例如，你可能会在JavaScript中试图使用像 \\" 这样的快捷转义，但是这样做是危险的，可能会被浏览器中的层级解析器误解。你也可能忘记转义转义字符，攻击者可以中和掉你的转义。OWASP建议使用一个专注安全的编码库，以确保这些规则正确实施。

Microsoft为.NET平台提供了一个名为[Microsoft Anti-Cross Site Scripting Library](http://wpl.codeplex.com/)的编码库，并且ASP.NET Framework内置了[ValidateRequest](https://msdn.microsoft.com/en-us/library/ms972969.aspx#securitybarriers_topic6)函数，可以进行一定程度的清洗。

 OWASP的[OWASP Java Encoder Project](https://www.owasp.org/index.php/OWASP_Java_Encoder_Project)是为Java提供的高性能编码库。

## 2 XSS防御规则

以下规则旨在防御应用程序中所有XSS。尽管这些规则不允许绝对自由地将不可信数据放入HTML文档，但它们应该能覆盖绝大多数常见用例。在你团队中可能不必开启所有的规则。许多团队可能会发现只运行规则1和规则2就足够满足他们的需求。如果有些额外的上下文是经常需要的，并且可以通过转义进行保护，请在讨论页面上添加讨论。

不要简单地转义在各种规则中提供的示例字符。仅仅转义这个列表是不够的，黑名单方法相当脆弱。这里的白名单规则经过精心设计，即使针对由浏览器更改引入的未来漏洞，也能提供保护。

### 2.1 规则0，除了在允许的位置，绝不能在其他位置插入不可信数据

首要规则是拒绝全量——不要把不可信数据放到你的HTML文档中，除非是放到规则1或者规则5定义的插槽中。规则0的原因是，HTML中有很多奇怪的上下文，转义规则列表变的非常的复杂。在这种复杂的情况下，我们找不到一个理由在这些上下文中放置放置不可信数据。这包含了像在JavaScript中的URL这种嵌套上下文，这些位置的编码规则是相当棘手与危险的。如果你坚持把不可信的数据放到嵌套的上下文中，请做大量的跨浏览器测试，并让我们知道你发现了什么。

```
 <script>...永远不要在这里放置不可信数据...</script>     直接在Script中
 <!--...永远不要在这里放置不可信数据...-->               在HTML注释中
 <div ...永远不要在这里放置不可信数据...=test />         属性名称
 <永远不要在这里放置不可信数据... href="/test" />        标签名称
 <style>...永远不要在这里放置不可信数据...</style>       直接在CSS中
```

最重要的是永远不要接受来自不可信来源的JavaScript代码然后运行它。例如，一个名为"callback"的参数包含JavaScript代码片段，再多的转义也不能解决这个问题。

### 2.2 规则1，将不可信数据插入到HTML元素内容之前，进行HTML转义

规则1适用于将不可信数据放到HTML标签内的地方，例如 div、p、b、td等常见标签。大多数的Web框架都有一个HTML转义的方法，来转义下面将要说到的字符，但是这种转义对于其他HTML上下文是绝对不够的，仍然需要执行其它规则。

```
 <body>...在这里插入不可信数据之前进行转义...</body>
 <div>...在这里插入不可信数据之前进行转义...</div>
 其他正常的 HTML 标签
```

使用HTML实体编码转义下列字符，以防止切换到任何执行上下文，如切换到脚本、样式或事件处理程序上下文中。规范推荐使用十六进制实体进行编码，除了XML（＆，<，>，"，'）中的5个重要字符之外，还包括正斜杠，因为它可以结束HTML实体。

 ```
 & --> &amp;
 < --> &lt;
 > --> &gt;
 " --> &quot;
 ' --> &#x27;     &apos; 不推荐，因为它不在HTML规范中, &apos;存在于在XML和XHTML规范中。
 / --> &#x2F;     包括正斜杠，因为它有可以结束一个HTML实体
 ```

### 2.3 规则2，将不可信数据插入到HTML通用属性之前，进行HTML Attribute转义

规则2是将不可信数据放入典型的属性值里，如 width, name和value 等。这个规则不应该用于复杂属性：href、src、style，或者诸如onmouseover等事件处理程序。 作为HTML JavaScript数据，事件处理程序这类属性应该遵循规则3，这一点是非常重要的。

```
 <div attr=...在这里插入不可信数据之前进行转义...>内容</div>      属性值无引号包裹
 <div attr='...在这里插入不可信数据之前进行转义...'>内容</div>    属性值使用单引号包裹
 <div attr="...在这里插入不可信数据之前进行转义...">内容</div>    属性值使用双引号包裹
```

除了字母数字字符以外，使用 &#xHH;(或者可用的命名实体)格式来转义ASCII值小于256所有的字符，来防止切换出属性上下文。这个规则覆盖这么多字符的原因是开发者写属性时经常不把属性放到引号之中。相应的引号包裹的属性只能用相应的引号转义规则。没有引号的属性可能使用很多字符来分开：包括 [ 空格 ] %  * + , - / ; < = > ^ 和 |。

 ### 2.4 规则3，将不可信数据插入到JavaScript数据值之前，进行JavaScript转义

 规则3涉及动态生成的 JavaScript 代码——script 块和事件处理程序属性中。将不可信数据放入此类代码片段的唯一安全位置：引号包裹的数值位置。在其他任何 JavaScript 上下文中包含不可信数据都是相当危险的，因为使用包含但是不限于分号、等号、空格、加号等字符来切换到一个执行上下文是非常容易的，所以请谨慎使用。

```
 <script>alert('...在这里插入不可信数据之前进行转义...')</script>                 写在引号包裹的字符串中
 <script>x='...在这里插入不可信数据之前进行转义...'</script>                      写在表达式中的引号中
 <div onmouseover="x='...在这里插入不可信数据之前进行转义...'"</div>              写在引号包裹的事件处理程序中
```

请注意，有些JavaScript函数不能安全的使用不可信数据作为输入——即便是进行JavaScript 转义！
例如：

```
<script>
  window.setInterval('...即便对不可信数据进行了转义，这里仍然可能遭受XSS 攻击…’);
</script>
```
除字母数字字符外，请使用\xHH格式转义ASCII码小于256的所有字符，以防止从数据值切换到Script上下文或者进入其他属性。不要使用像 \\" 这样的快捷转义方式，因为引号字符可能与先运行的HTML属性解析器相匹配，这些快捷转义方式也容易受到攻击者把转义字符进行转义 ，例如攻击者发送了一个 \\"，这样把引号转义之后就成了 \\\\"，最终允许了引号的存在。

如果一个事件处理程序使用引号包裹，就需要一个与之对应的引号结束。我们故意将这个转义规则定的相当宽泛，是因为事件处理程序常不加引号。未加引号的属性可以被很多字符截断，包括 [ 空格 ] % * + , - / ; < = > ^ 和 |。此外，\</script>结束标记将关闭脚本块，即使它位于带引号的字符串内，因为HTML解析器在JavaScript解析器之前运行。


### 2.4.1 规则 3.1 在HTML上下文中对JSON值进行HTML转义，并使用JSON.parse读取

在Web 2.0世界中，需要在Javascript上下文中使用程序动态生成数据的需求是很常见的。一种策略是使用Ajax调用来获取数据，但是在有些情况下是这种方式不可行。通常我们加载一个JSON初始化到页面中，作为一个存储多种类型数值的位置。在不破坏值的格式和内容情况下，对这些数据进行转义不是不可能的，但是却相当的棘手。

确保响应的Content-Type头是application/json而不是application/html。这样可以让浏览器不误解上下文并执行插入的脚本。

不好的HTTP响应：

```
   HTTP/1.1 200
   Date: Wed, 06 Feb 2013 10:28:54 GMT
   Server: Microsoft-IIS/7.5....
   Content-Type: text/html; charset=utf-8 <-- 不好
   ....
   Content-Length: 373
   Keep-Alive: timeout=5, max=100
   Connection: Keep-Alive
   {"Message":"No HTTP resource was found that matches the request URI 'dev.net.ie/api/pay/.html?HouseNumber=9&AddressLine
   =The+Gardens<script>alert(1)</script>&AddressLine2=foxlodge+woods&TownName=Meath'.","MessageDetail":"No type was found
   that matches the controller named 'pay'."}   <-- 脚本中的alert会执行
```

好的HTTP响应：

```
   HTTP/1.1 200
   Date: Wed, 06 Feb 2013 10:28:54 GMT
   Server: Microsoft-IIS/7.5....
   Content-Type: application/json; charset=utf-8 <--好
   .....
   .....
```
一个常见的错误示例如下：

```
<script>
  var initData = <%= data.to_json %>; // 不要这样做，除非使用下列的一种技术对数据进行了编码
</script>
```
#### 2.4.1.1 JSON 实体编码

JSON编码规则可以在[输出编码规则摘要](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#Output_Encoding_Rules_Summary)中找到。请注意，这种方式下我们将无法使用CSP 1.0提供的XSS保护策略。

#### 2.4.1.2 HTML实体编码

这种技术的优点是，HTML实体转义得到了广泛的支持，有助于在不跨越上下文边界的情况下从服务端代码中分离数据。把JSON块作为普通元素放到页面上，然后解析 innnerHTML来获取内容。读取数据的Javascript可以存在于外部文件中，从而使得CSP实施起来更加的容易。

```
<div id="init_data" style="display: none">
  <%= html_escape(data.to_json) %>
</div>
```

```
// 外部的js文件
var dataElement = document.getElementById('init_data');
// 解码并解析div的内容
var initData = JSON.parse(dataElement.textContent);
```

一个直接在JavaScript中转义并解转义的替代方案是，在数据发送到浏览器之前，在服务端对JSON数据进行处理，把 '<'转义成为 '\u003c' 。

### 2.5 规则4，将不可信数据插入到HTML Style属性值之前，进CSS转义并严格验证

规则4适用于将不可信数据插入到style样式表或者内敛style属性中。CSS出人意料的强大，可以用于许多攻击。因此，仅在属性值中使用不可信数据，而不要在其他位置使用，这一点非常的重要。应该避免将不可信数据插入到复杂的属性之中，如 URL、behavior以及自定义的-moz-binding类属性。也不应该把不可信数据插入到可执行JavaScript代码的IE表达式属性中。

```
 <style>selector { property : ...在这里插入不可信数据之前进行转义...; } </style>     属性值
 <style>selector { property : "...在这里插入不可信数据之前进行转义..."; } </style>   属性值
 <span style="property : ...在这里插入不可信数据之前进行转义...">text</span>         属性值
```

请注意，有一些CSS上下文不能安全的将不可信数据作为输入——即使正确的使用了CSS转义！你要保证URL只能以http而不能以javascript开头，而且这些属性不能以 expression开头。例如：

```
{ background-url : "javascript:alert(1)"; }  // 其他的URL类属性也是如此
{ text-size: "expression(alert('XSS'))"; }   // 只出现在IE中
```

除了字母数字字符以外，使用\HH格式来转义ASCII值小于256的所有字符。不要使用像 \\" 这样的快捷转义方式，因为引号字符可能与先运行的HTML属性解析器相匹配，这些快捷转义方式也容易受到攻击者 "把转义字符进行转义" ，例如攻击者发送了一个 \\"，这样把引号转义之后就成了 \\\\"，最终允许了引号的存在。

如果属性是被引号包裹的，需要使用对应的引号结束。所有的属性都应该放置到引号之中，但是程序应该具有健壮的编码来防御XSS，毕竟不可信数据可能没有放置到引号之中。未加引号的属性可以被很多字符截断，包括 [ 空格 ] % * + , - / ; < = > ^ 和 |。另外，\</style>标记将关闭样式块，即使它位于带引号的字符串中，因为HTML解析器在JavaScript解析器之前运行。请注意，对于无论引号包裹还是没有引号包裹的属性，我们建议积极的CSS编码和验证来阻止XSS攻击。

### 2.6 规则5，将不可信数据插入到HTML URL参数值之前， 进行URL转义

规则5适用于将不可信参数作为HTTP GET 参数值时。

```
<a href="http://www.somesite.com?test= ...在这里插入不可信数据之前进行转义..."> link </a>
```

除了字母数字字符以外，使用%HH格式来转义ASCII值小于256的所有字符。URL不应该出现在不可信数据之中，因为没有好办法通过转义来防止切换出URL上下文。所有的属性都应该使用引号包裹。没有引号包裹的属性可以使用许多字符来中断，包括 [space] % * + , - / ; < = > ^ 和 | 等。请注意，在这个上下文实体编码是无效的。

警告：不要使用URL编码对完整或相对URL进行编码！如果不信任的输入是要放入href，src或其他基于URL的属性，应该验证它是否指向其他协议，特别是JavaScript链接。然后应该像对待其他数据一样，根据相应的上下文对URL进行编码。例如，href属性中的URL应该是使用属性编码的。例如：

```
String userURL = request.getParameter( "userURL" )
 boolean isValidURL = Validator.IsValidURL(userURL, 255);
 if (isValidURL) {
     <a href="<%=encoder.encodeForHTMLAttribute(userURL)%>">link</a>
 }
```

### 2.7 规则6，使用专业库来清洗HTML标记

如程序处理html标记时，果不可信的输入包含html，可能非常的难以验证。编码也是非常困难的，因为它会转义应该出现在输入中的所有标签。因此你需要一个可以解析和清洗HTML格式文本的库。在OWASP有几个简单易用的版本：

HtmlSanitizer - https://github.com/mganss/HtmlSanitizer

这是一个开源的.NET库，HTML使用白名单方式进行清洗。所有允许的标签和属性都是可以配置的。该库使用[OWASP XSS过滤漏洞备忘单](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)进行过单元测试：

```
var sanitizer = new HtmlSanitizer();
sanitizer.AllowedAttributes.Add("class");
var sanitized = sanitizer.Sanitize(html);
```

OWASP Java HTML Sanitizer - [OWASP Java HTML Sanitizer Project](https://www.owasp.org/index.php/OWASP_Java_HTML_Sanitizer_Project)

```
import org.owasp.html.Sanitizers;
import org.owasp.html.PolicyFactory;
PolicyFactory sanitizer = Sanitizers.FORMATTING.and(Sanitizers.BLOCKS);
String cleanResults = sanitizer.sanitize("<p>Hello, <b>World!</b>");
```

有关OWASP Java HTML清洗策略的更多信息，请参阅 https://github.com/OWASP/java-html-sanitizer

Ruby on Rails SanitizeHelper - http://api.rubyonrails.org/classes/ActionView/Helpers/SanitizeHelper.html

SanitizeHelper模块提供了一套用于清理不需要的HTML元素的文本的方法。

```
<%= sanitize @comment.body, tags: %w(strong em a), attributes: %w(href) %>
```

其他提供HTML清洗的库包括：
PHP HTML Purifier - http://htmlpurifier.org/
JavaScript/Node.js Bleach - https://github.com/ecto/bleach
Python Bleach - https://pypi.python.org/pypi/bleach

### 2.8 规则 7，防止 DOM-based XSS

有关基于DOM的XSS的详细信息，以及针对此类XSS缺陷的防范，请参阅[基于DOM的XSS预防备忘单](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet)此篇OWASP文章。

### 2.9 加分规则1，使用HTTPOnly Cookie标记

正如你所看到的，防止应用程序中的所有XSS缺陷是困难的。为了帮助减轻XSS漏洞对网站的影响，OWASP还建议您在session Cookie上设置HTTPOnly标志，并为那些不能被JavaScript访问的自定义cookie也设置这个标志。这个cookie标志通常在.NET应用程序中默认处于打开状态，但在其他语言中，必须手动设置它。有关HTTPOnly cookie标志的更多详细信息，包括它的作用，以及如何使用，请参阅OWASP上[HTTPOnly](https://www.owasp.org/index.php/HTTPOnly)的文章。

### 2.10 加分规则2，实施内容安全策略

还有一个很好的复杂的解决方案（内容安全策略）可以减轻XSS漏洞的影响。这是一个浏览器端机制，允许你为Web应用程序的客户端资源（例如JavaScript，CSS，图像等）创建源白名单。CSP通过特殊的HTTP标头指示浏览器仅执行或呈现来自这些源的资源。比如这个CSP：

```
Content-Security-Policy: default-src: 'self'; script-src: 'self' static.domain.tld
```
将指示Web浏览器仅加载来自页面源的资源和static.domain.tld下的JavaScript源代码文件。有关内容安全策略的更多详细信息，包括其内容，以及如何使用，请参阅OWASP上[Content_Security_Policy](https://www.owasp.org/index.php/Content_Security_Policy)的文章。

### 2.11 加分规则3，使用自动转义模板系统

许多Web应用程序框架提供了自动的上下文转义功能，如[AngularJS严格的上下文转义](https://docs.angularjs.org/api/ng/service/$sce)和[Go模板](https://golang.org/pkg/html/template/)，请尽可能使用这些技术。

### 2.12 加分规则4，使用X-XSS-Protection响应头

这个HTTP响应头可以把内置在一些现代浏览器的XSS防御机制打开。这个头文件默认是启用的，它的作用是如果用户禁用了规则，可以重新设置启用。


## 3 XSS 防御规则汇总

以下表格展示了在不同的上下文如何安全的显示不可信数据：

数据类型 | 上下文 | 代码示例 | 防御措施
------------ | ------------- | ------------- | -------------
字符串 | HTML结构体 | \<span>不可信数据\</span> | [HTML实体编码](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content)
字符串 | 安全的HTML属性 | \<input type="text" name="fname" value="不可信数据">| [积极的HTML实体编码](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.232_-_Attribute_Escape_Before_Inserting_Untrusted_Data_into_HTML_Common_Attributes)<br>只将不可信数据放到白名单属性中（下面会列出）<br>对background, id 和 name这些不安全属性进行严格校验
字符串 | GET参数 | \<a href="/site/search?value=不可信数据">clickme\</a>| [URL编码](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.235_-_URL_Escape_Before_Inserting_Untrusted_Data_into_HTML_URL_Parameter_Values)
字符串 | src或者href属性中的URL | \<a href="不可信URL">clickme\</a><br>\<iframe src="不可信URL" /> | 规范输入<br>URL验证<br>安全URL验证<br>只能是HTTP或者HTTPS协议（[避免JavaScript协议打开一个新窗口](https://www.owasp.org/index.php/Avoid_the_JavaScript_Protocol_to_Open_a_new_Window)）<br>属性编码
字符串 | CSS值 |\<div style="width: 不可信数据;">Selection\</div> |[严格的结构验证](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.234_-_CSS_Escape_And_Strictly_Validate_Before_Inserting_Untrusted_Data_into_HTML_Style_Property_Values)<br>CSS十六进制编码<br>良好的CSS特性设计模式<br>
String | JavaScript值 | \<script>var currentValue='不可信数据';\</script> <br>\<script>someFunction('不可信数据');\</script>|确保JavaScript变量使用引号包裹<br>JavaScript 16进制编码<br>JavaScript Unicode编码<br>避免反斜线编码（\\"或\\'或\\\\）<br>
HTML | HTML结构体 | \<div>不可信 HTML\</div> | [HTML Validation (JSoup, AntiSamy, HTML Sanitizer)](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#RULE_.236_-_Use_an_HTML_Policy_engine_to_validate_or_clean_user-driven_HTML_in_an_outbound_way)
字符串 | DOM XSS | \<script>document.write("不可信输入: " + document.location.hash);\</script> | [基于DOM的XSS防御备忘](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet)

安全的HTML属性包括：align, alink, alt, bgcolor, border, cellpadding, cellspacing, class, color, cols, colspan, coords, dir, face, height, hspace, ismap, lang, marginheight, marginwidth, multiple, nohref, noresize, noshade, nowrap, ref, rel, rev, rows, rowspan, scrolling, shape, span, summary, tabindex, title, usemap, valign, value, vlink, vspace, width

## 4 输出编码规则汇总

输出编码（因为导致XSS）的目的是将不可信输入转换为安全形式，以输入数据的形式显示给用户，而不在浏览器中执行代码。以下表格详细列出了防御XSS所需的关键编码方法。

编码类型 | 编码机制
------------ | -------------
HTML 实体编码 | 把 & 转化为 `&amp;` <br> 把 < 转化为 `&lt;`  <br> 把 > 转化为 `&gt`;  <br> 把 " 转化为 `&quot;` <br> 把 ' 转化为 `&#x27;` <br>  把 / 转化为 `&#x2F;` <br>
HTML 属性编码 | 除字母数字字符外，请使用HTML实体&#xHH;的格式编码所有字符，包括空格。（HH=十六进制值）
URL 编码 | 标准编码，请参阅：http : //www.w3schools.com/tags/ref_urlencode.asp。<br>网址编码只能用于编码参数值，而不能用于URL的整个URL或路径片段。
JavaScript 编码 | 除字母数字字符外，请使用\uXXXX unicode转义格式（X=整数）转义所有字符。
CSS 16进制编码 | CSS转义支持\XX和\XXXXXX。如果下一个字符继续转义序列，则使用双字符转义可能会导致问题。有两种解决方案：<br>（a）在CSS转义之后添加一个空格（将被CSS解析器忽略）<br>（b）通过零填充值使用全部的CSS转义量。


[英文原文](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet)
