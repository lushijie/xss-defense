# XSS(Cross Site Scripting)防御手册

## 1 引言

本文提供了一个简单的正向机制来阻止 [XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))：恰当地输出转义/编码后数据。虽然有大量的 XSS 攻击方式，但是遵循一些简单的规则可以完全抵御这些严重攻击。
本文不探讨 XSS 的对技术、业务的影响，只说 XSS 可以导致攻击者能够具有操作浏览器的能力。

[反射型和存储型 XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)#Stored_and_Reflected_XSS_Attacks)都可以通过在服务端执行适当的验证和转义来规避。[基于DOM的XSS](https://www.owasp.org/index.php/DOM_Based_XSS) 可以使用 [基于DOM的XSS预防手册](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet) 一文中描述的子集规则来避免。

有关XSS相关的攻击方法，请参阅[XSS过滤规避手册](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)。在[浏览器安全手册](https://code.google.com/archive/p/browsersec/)可以找到关于浏览器安全和各种浏览器的更多背景。

在阅读本文之前，需要对[注入理论](https://www.owasp.org/index.php/Injection_Theory)有个基本了解。

### 1.1 积极的XSS防御模型

本文将HTML页面视为模板，并允许开发人员在插槽(slots)中插入不可信数据。这些插槽覆盖了绝大多数开发人员放置不可信数据的位置。不允许在在 HTML 的其他位置放置不可信数据。这是一个白名单模式，只有在白名单之中的才是被允许的。

鉴于浏览器解析HTML的方式，不同类型的插槽具有稍微不同的安全规则。将不可信数据放入到插槽时，需要采取一定的措施来确保数据不会从该插槽中跳到允许执行代码的上下文中。从某种意义上，这种方法将HTML文档视为参数化的数据库查询——数据保存在特定的位置，并通过转义与代码上下文隔离。

本文列出了安全地将不可信数据放入常见的插槽的规则。基于大量的规则、已知的XSS攻击方法和大量的先进浏览器的测试，我们可以保证我们提出的规则是安全的。

我们定义了插槽位置并对每个插槽提供了几个例子。为了确保安全，开发人员不应该在没有仔细分析的情况下就将不可信数据放入到其它插槽位置。浏览器解析是非常棘手的，许多看起来无害的角色可能在特定的上下文中起非常重要的作用。

### 1.2 为什么不能对不可信数据只进行 HTML 实体编码？

HTML实体编码对于用来编码放置在HTML标签中的不可信数据是可以的，例如\<div>标记内。对于使用引号包裹的属性，使用HTML实体编码对于不可信数据来说也是可行的。但是，如果你将不可信的数据放置到<script>标记的任何位置、onmouseover事件处理程序、CSS内部或者URL中，那么HTML实体编码就不起作用了,这时即便你到处使用HTML实体编码仍然可能遭受XSS攻击。你必须对特定HTML文档部分放置的不可信数据，使用编码语法进行处理。这也是我们下面所要讲的。
  
  ### 1.3 你需要一个安全的编码库
  
  编写这些编码器并不是非常困难，但是也有不少隐藏的陷阱。例如，你可能会在 JavaScript 中试图使用像 \" 这样的快捷转义。但是,这样做是危险的，可能会被浏览器中的嵌套解析器
  
  
  
  
