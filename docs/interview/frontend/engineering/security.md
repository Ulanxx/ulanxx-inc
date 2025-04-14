# 前端安全

## **1. XSS（跨站脚本攻击）是什么？如何防御？**

✅ **考察点**：对 **XSS 原理、类型、预防策略** 的理解。

✅ **示例回答**：
**XSS（Cross-Site Scripting）** 是指攻击者在网页中注入恶意 JavaScript 代码，导致用户数据泄露、页面篡改等问题。常见类型：

1. **存储型 XSS**：恶意脚本存储在服务器，其他用户访问时执行。
2. **反射型 XSS**：恶意脚本通过 URL 传递，服务器未过滤，用户点击触发。
3. **DOM 型 XSS**：前端代码动态插入未经处理的用户输入。

**防御方法**：

1. **输入 & 输出过滤**：使用 `encodeURIComponent`、`innerText` 处理用户输入。
   ```js
   document.getElementById("output").innerText = userInput;
   ```
2. **Content Security Policy (CSP)**：限制页面执行的脚本来源。
   ```http
   Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com;
   ```
3. **使用 HTTP-only Cookie** 防止 JS 访问敏感 Cookie。

---

## **2. CSRF（跨站请求伪造）是什么？如何防御？**

✅ **考察点**：**CSRF 攻击原理、如何防御**。

✅ **示例回答**：
CSRF（Cross-Site Request Forgery）指攻击者伪造用户请求，在用户不知情的情况下执行恶意操作（如修改密码、转账）。

**防御方法**：

1. **CSRF Token 机制**：服务器返回 Token，验证请求来源是否可信。
   ```js
   <input type="hidden" name="csrf_token" value="randomToken123">
   ```
2. **SameSite Cookie**：限制 Cookie 仅在同源请求中发送。
   ```http
   Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict;
   ```
3. **Referer / Origin 头验证**：检查请求是否来自可信域名。

---

## **3. CORS（跨域资源共享）是什么？如何安全使用？**

✅ **考察点**：对 **跨域机制、CORS 安全风险** 的理解。

✅ **示例回答**：
CORS（Cross-Origin Resource Sharing）是一种浏览器安全策略，允许服务器控制哪些源可以访问资源。

**安全使用**：

1. **限制可信域**：
   ```http
   Access-Control-Allow-Origin: https://trusted.com
   ```
2. **限制请求方法 & 头部**：
   ```http
   Access-Control-Allow-Methods: GET, POST
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```
3. **使用 Token 而非 Cookie 进行身份认证**，避免跨域 Cookie 被攻击者利用。

---

## **4. 如何防止点击劫持（Clickjacking）？**

✅ **考察点**：**Clickjacking 原理 & 防御策略**。

✅ **示例回答**：
Clickjacking 指攻击者在透明 `iframe` 中嵌套受害页面，诱导用户点击隐藏按钮。

**防御方法**：

1. **X-Frame-Options** 禁止页面嵌套：
   ```http
   X-Frame-Options: DENY
   ```
2. **CSP Frame Ancestors** 限制可嵌套的来源：
   ```http
   Content-Security-Policy: frame-ancestors 'self' https://trusted.com;
   ```
3. **JS 方式检测是否被嵌套**：
   ```js
   if (window.top !== window.self) {
     document.body.innerHTML = "<h1>Clickjacking detected</h1>";
   }
   ```

---

## **5. 前端如何存储敏感信息？为什么不能存储在 LocalStorage？**

✅ **考察点**：**安全存储方案、LocalStorage 风险**。

✅ **示例回答**：
**LocalStorage 存在以下安全问题**：

1. **XSS 攻击**：JS 代码可以读取 LocalStorage，导致 Token 被盗。
2. **不能设置 HttpOnly & Secure**，Cookie 更安全。

**更安全的做法**：

1. **Token 存在 HttpOnly Cookie**，避免 XSS 读取。
2. **使用 SessionStorage 代替 LocalStorage**，防止长期存储。
3. **Token 短时存储，使用 Refresh Token 续期**。

---

## **6. 如何防止 npm 包供应链攻击？**

✅ **考察点**：**npm 安全风险、如何防范**。

✅ **示例回答**：
npm 供应链攻击是指攻击者在开源包中注入恶意代码，影响项目安全。

**防御方法**：

1. **使用 `package-lock.json` 固定依赖版本**：
   ```sh
   npm ci
   ```
2. **使用 `npm audit` 检测漏洞**：
   ```sh
   npm audit fix
   ```
3. **启用 Snyk、Dependabot 自动监测安全漏洞**。

---

## **7. 代码发布时如何确保安全性？**

✅ **考察点**：**代码发布流程、自动化安全检查**。

✅ **示例回答**：

1. **代码审计 & 静态扫描**（SonarQube / ESLint）检查漏洞。
2. **CI/CD 执行安全测试**：
   ```yaml
   jobs:
     security-check:
       script:
         - npm audit --production
         - sonar-scanner
   ```
3. **代码签名（Code Signing）** 确保代码完整性。

---

## **8. 你了解 JWT（JSON Web Token）安全风险吗？如何防止被盗用？**

✅ **考察点**：**JWT 安全漏洞 & 解决方案**。

✅ **示例回答**：
**JWT 常见安全问题**：

1. **Token 泄露**：攻击者获取 Token 后可冒充用户。
2. **Token 永不过期**：Token 长时间有效，增加被盗风险。

**最佳实践**：

1. **短时 Token + Refresh Token**，定期刷新：
   ```js
   const token = jwt.sign({ userId: 123 }, SECRET, { expiresIn: "15m" });
   ```
2. **签发时加入 IP 绑定**，防止 Token 被盗用：
   ```js
   const token = jwt.sign({ userId: 123, ip: userIp }, SECRET);
   ```

---

## **9. 你如何在 GitLab / GitHub 中存储环境变量，避免泄露？**

✅ **考察点**：**安全存储敏感信息**。

✅ **示例回答**：

1. **使用 `.env` 文件，不提交到 Git**：
   ```sh
   echo ".env" >> .gitignore
   ```
2. **GitHub Actions / GitLab CI 变量存储**：
   ```yaml
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```
3. **加密敏感信息（Vault / AWS Secrets Manager）**。

---

## **10. 如何防止 API 被滥用（爬虫、暴力攻击）？**

✅ **考察点**：**API 保护策略**。

✅ **示例回答**：

1. **IP 限流（Rate Limiting）**：
   ```sh
   429 Too Many Requests
   ```
2. **JWT + 签名认证**，防止伪造请求：
   ```js
   const hash = crypto
     .createHmac("sha256", secret)
     .update(payload)
     .digest("hex");
   ```
3. **验证码（reCAPTCHA）** 限制机器请求。
