# XSS（Cross Site Scripting）预防手册

## 1 引言

本文提供了一个简单的正向机制来阻止 [XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS))：恰当地输出转义/编码后数据。虽然有大量的 XSS 攻击方式，但是遵循一些简单的规则可以完全抵御这些严重攻击。
本文不探讨 XSS 的对技术、业务的影响，只说 XSS 可以导致攻击者能够具有操作浏览器的能力。

[反射型和存储型 XSS](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)#Stored_and_Reflected_XSS_Attacks)都可以通过在服务端执行适当的验证和转义来规避。[基于DOM的XSS](https://www.owasp.org/index.php/DOM_Based_XSS) 可以使用 [基于DOM的XSS预防手册](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet) 一文中描述的子集规则来避免。

有关XSS相关的攻击方法，请参阅[XSS过滤规避手册](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)。在[浏览器安全手册](https://code.google.com/archive/p/browsersec/)可以找到关于浏览器安全和各种浏览器的更多背景。

在阅读本文之前，需要对[注入理论](https://www.owasp.org/index.php/Injection_Theory)有个基本了解。
