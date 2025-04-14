# 计算机网络

## **1. HTTP 和 HTTPS 的区别？**

✅ **考察点**：安全性、性能、加密。

✅ **示例回答**：

1. **加密**：HTTP 是明文传输，HTTPS 使用 **TLS/SSL** 加密数据，防止窃听和篡改。
2. **端口**：HTTP 默认 **80**，HTTPS 默认 **443**。
3. **身份验证**：HTTPS 需要 **SSL 证书** 来保证服务器身份真实性。
4. **SEO 友好**：搜索引擎更偏好 HTTPS。
5. **性能**：HTTPS 结合 **HTTP/2**，支持 **多路复用**、**头部压缩**，比 HTTP 更快。

---

## **2. HTTP1.1、HTTP2、HTTP3 的区别？**

✅ **考察点**：协议优化、性能提升点。

✅ **示例回答**：
| 版本 | 主要特性 |
|------|---------|
| **HTTP/1.1** | 长连接（keep-alive）、管道化（已废弃） |
| **HTTP/2** | **多路复用**（一个连接多个请求）、**头部压缩**（HPACK）、二进制格式传输 |
| **HTTP/3** | 基于 **QUIC**（UDP），减少 TCP 连接建立时间，降低网络延迟 |

---

## **3. 什么是 TCP 三次握手和四次挥手？**

✅ **考察点**：TCP 连接原理、可靠性。

✅ **示例回答**：

### **三次握手（建立连接）**：

1. **客户端 → 服务器**（SYN）：请求建立连接。
2. **服务器 → 客户端**（SYN-ACK）：同意连接，并返回确认。
3. **客户端 → 服务器**（ACK）：确认收到，建立连接。

### **四次挥手（断开连接）**：

1. **客户端 → 服务器**（FIN）：请求断开连接。
2. **服务器 → 客户端**（ACK）：确认请求，但仍可传输数据。
3. **服务器 → 客户端**（FIN）：通知断开连接。
4. **客户端 → 服务器**（ACK）：确认断开，连接关闭。

---

## **4. 什么是 DNS？DNS 解析的过程？**

✅ **考察点**：域名解析原理。

✅ **示例回答**：

1. 浏览器缓存（检查是否已经解析过）。
2. 操作系统缓存（本地 `hosts` 文件）。
3. 本地 DNS 服务器（ISP 提供的 DNS 服务器）。
4. **递归查询**：
   - **根 DNS 服务器**（返回顶级域名 .com 的地址）。
   - **顶级域名（TLD）服务器**（返回具体域名的地址）。
   - **权威 DNS 服务器**（返回最终 IP 地址）。

---

## **5. 强缓存与协商缓存的区别？**

✅ **考察点**：缓存策略、优化性能。

✅ **示例回答**：
| 类型 | 机制 | 关键字段 | 说明 |
|------|------|---------|------|
| **强缓存** | 直接使用缓存 | `Expires`（绝对时间）`Cache-Control`（相对时间） | 资源不过期则直接使用缓存，不发请求 |
| **协商缓存** | 服务器确认缓存是否可用 | `ETag`（文件指纹）`Last-Modified`（最后修改时间） | 资源可能已更新，发请求验证 |

---

## **6. 什么是 CORS？如何解决跨域问题？**

✅ **考察点**：浏览器同源策略、跨域解决方案。

✅ **示例回答**：

### **CORS 机制**

1. **简单请求**（GET、POST 不带复杂头部）：服务器返回 `Access-Control-Allow-Origin`。
2. **预检请求**（OPTIONS 请求）：服务器返回 `Access-Control-Allow-Methods`、`Access-Control-Allow-Headers`。

### **其他跨域方案**

- **JSONP**（仅支持 GET）
- **代理服务器**（Nginx 反向代理）
- **WebSocket**（不受同源策略限制）

---

## **7. CDN 的作用是什么？**

✅ **考察点**：CDN 工作原理、优化点。

✅ **示例回答**：

1. **减少延迟**：通过**就近访问**提高加载速度。
2. **减轻源站压力**：缓存静态资源，减少服务器负担。
3. **提升可用性**：CDN 服务器**分布式部署**，防止单点故障。
4. **带宽优化**：减少重复请求，节省网络带宽。

---

## **8. 什么是 HTTP 头部 Referer？如何防止 Referer 泄露？**

✅ **考察点**：信息泄露、Referer 头作用。

✅ **示例回答**：

1. **Referer 作用**：
   - 记录当前请求的来源页面，用于**统计分析**、**防盗链**等。
2. **防止泄露敏感信息**：
   - `Referrer-Policy: no-referrer`（不发送 Referer）。
   - `Referrer-Policy: same-origin`（同源才发送 Referer）。

---

## **9. HTTP 状态码有哪些？**

✅ **考察点**：HTTP 响应状态码。

✅ **示例回答**：
| 状态码 | 说明 |
|------|------|
| **2XX** | **成功**（200 OK，201 Created） |
| **3XX** | **重定向**（301 永久重定向，302 临时重定向） |
| **4XX** | **客户端错误**（400 Bad Request，403 Forbidden，404 Not Found） |
| **5XX** | **服务器错误**（500 Internal Server Error，502 Bad Gateway） |

---

## **10. HTTP/2 多路复用的原理？**

✅ **考察点**：提升性能的方式。

✅ **示例回答**：

1. HTTP/1.1 存在**队头阻塞**问题，HTTP/2 采用**二进制帧**传输数据。
2. **多路复用**：一个 TCP 连接中多个请求**并行发送**，无序返回，避免阻塞。

---

## **11. WebSocket 和 HTTP 的区别？**

✅ **考察点**：长连接、实时通信。

✅ **示例回答**：

1. **HTTP**：请求-响应模式，客户端发请求，服务器返回数据。
2. **WebSocket**：建立后**全双工通信**，适用于**实时聊天、游戏、推送**。

---

## **12. 如何优化网站的网络性能？**

✅ **考察点**：前端性能优化策略。

✅ **示例回答**：

1. **启用 HTTP/2**（支持多路复用）。
2. **使用 CDN**（减少延迟）。
3. **开启 Gzip 压缩**（减少文件体积）。
4. **使用强缓存和协商缓存**（减少请求）。
5. **减少 DNS 查询**（合并资源）。

---

## **13. 什么是 TCP 的 Nagle 算法？**

✅ **考察点**：TCP 传输优化。

✅ **示例回答**：
Nagle 算法**减少小包发送次数**，合并多个小数据包，提高网络传输效率。

---

## **14. 301 和 302 的区别？**

✅ **考察点**：SEO、重定向。

✅ **示例回答**：

- **301**：永久重定向，搜索引擎更新索引。
- **302**：临时重定向，不改变索引。

---

## **15. 如何防止 HTTP 劫持？**

✅ **考察点**：网络安全。

✅ **示例回答**：

1. **强制 HTTPS**（HSTS 头部）。
2. **Content Security Policy（CSP）** 限制加载资源。
3. **DNSSEC** 保护 DNS 解析安全。
   这里是 **15 道高级浏览器网络相关面试题**，涵盖 **DNS、HTTP/2 & HTTP/3、CDN、缓存、跨域、WebSocket、网络优化、TCP/IP、网络安全等** 深入考点。

---

## **16. 浏览器是如何解析 URL 并渲染页面的？**

✅ **考察点**：浏览器工作流程、DNS 解析、渲染。

✅ **示例回答**：

1. **解析 URL**（检查浏览器缓存、DNS 解析获取 IP）。
2. **建立 TCP 连接**（三次握手）。
3. **发送 HTTP 请求**（请求头、请求方法）。
4. **服务器响应**（返回 HTML、CSS、JS 等资源）。
5. **解析 HTML & 构建 DOM 树**。
6. **CSS 解析 & 生成 CSSOM 树**。
7. **执行 JavaScript**（构建和操作 DOM）。
8. **合成渲染树 & 布局**（Layout & Paint）。
9. **GPU 处理 & 显示**（合成层 & 逐帧渲染）。

---

## **17. DNS 解析过程中如何防止 DNS 劫持？**

✅ **考察点**：DNS 劫持、网络安全。

✅ **示例回答**：

1. **使用 DNSSEC**（DNS Security Extensions，防止篡改）。
2. **使用 HTTPS & HSTS**（加密通信，避免中间人攻击）。
3. **使用 DoH（DNS over HTTPS）或 DoT（DNS over TLS）**（加密 DNS 查询）。
4. **使用可信赖的 DNS 服务器**（如 Google 8.8.8.8、Cloudflare 1.1.1.1）。

---

## **18. HTTP 长连接（Keep-Alive）和短连接的区别？**

✅ **考察点**：TCP 连接管理、性能优化。

✅ **示例回答**：
| 类型 | 连接方式 | 场景 |
|------|---------|------|
| **短连接** | 每次请求创建新的 TCP 连接，完成后立即关闭 | 低频请求，如 API 调用 |
| **长连接（Keep-Alive）** | 复用 TCP 连接，多次请求复用 | 适用于 HTTP/1.1，减少握手开销 |

---

## **19. HTTP/2 的头部压缩（HPACK）是如何工作的？**

✅ **考察点**：HTTP/2 优化机制。

✅ **示例回答**：
HTTP/2 使用 **HPACK（Header Compression for HTTP/2）** 压缩头部：

1. **静态表**：存储常见头部字段（如 `:method`, `:status`）。
2. **动态表**：缓存已传输的头部，避免重复传输。
3. **Huffman 编码**：减少头部大小，提升传输效率。

---

## **20. TCP 粘包和拆包是什么？如何解决？**

✅ **考察点**：TCP 数据传输、数据完整性。

✅ **示例回答**：

- **粘包**：多个小数据包被合并到一个 TCP 数据段中发送。
- **拆包**：一个数据包被分割成多个 TCP 数据段发送。

### **解决方案**：

1. **定长协议**：固定包大小。
2. **分隔符协议**：使用 `\n` 或特殊字符分隔数据包（如 HTTP 的 `\r\n`）。
3. **TLV 结构**（Type-Length-Value）：包头包含长度信息。

---

## **21. CDN 缓存的层级结构是怎样的？**

✅ **考察点**：CDN 工作机制、缓存策略。

✅ **示例回答**：

1. **浏览器缓存**（本地缓存）。
2. **CDN 边缘节点缓存**（距离用户最近）。
3. **CDN 中心节点缓存**（多个边缘节点同步）。
4. **源站缓存**（最终的原始服务器）。

---

## **22. HTTPS 为什么比 HTTP 慢？如何优化？**

✅ **考察点**：TLS 连接开销、优化方案。

✅ **示例回答**：
HTTPS 比 HTTP 慢的原因：

1. **TLS 握手**（多次密钥交换）。
2. **证书验证**（OCSP 查询）。
3. **加解密开销**（CPU 计算）。

### **优化方法**：

- **启用 TLS 1.3**（减少握手时间）。
- **使用 HTTP/2**（多路复用）。
- **开启 OCSP Stapling**（减少证书验证请求）。
- **使用 CDN**（减少延迟）。

---

## **23. WebSocket 如何处理断线重连？**

✅ **考察点**：WebSocket 连接管理。

✅ **示例回答**：

1. **使用 `setInterval` 定时检测连接状态**。
2. **监听 `onclose` 事件，自动尝试重连**。
3. **指数退避策略**（每次失败后增加重试间隔，防止频繁请求）。

---

## **24. 为什么 HTTP POST 不能被缓存？**

✅ **考察点**：HTTP 缓存机制。

✅ **示例回答**：

1. **POST 请求通常用于提交数据，结果可能变化**。
2. **浏览器默认不缓存 POST 响应**，但可以用 `Cache-Control` 设置缓存策略。

---

## **25. TCP 为什么需要四次挥手，而不是三次？**

✅ **考察点**：TCP 连接关闭机制。

✅ **示例回答**：

1. **三次足够建立连接**，但关闭连接时，服务器可能仍在发送数据，需要额外的 `FIN-ACK` 处理。
2. **四次挥手保证了服务器已完成数据传输，防止数据丢失**。

---

## **26. 前端如何检测 HTTP 请求的超时？**

✅ **考察点**：网络异常处理。

✅ **示例回答**：

1. **XHR & Fetch 设置超时**：
   ```js
   const controller = new AbortController();
   setTimeout(() => controller.abort(), 5000);
   fetch("/api", { signal: controller.signal }).catch((err) =>
     console.log("Request Timeout", err)
   );
   ```
2. **后端返回 `408 Request Timeout` 状态码**。

---

## **27. DNS 解析中 Local DNS 是如何工作的？**

✅ **考察点**：DNS 解析优化。

✅ **示例回答**：

1. 浏览器检查本地缓存。
2. **Local DNS 服务器** 查询根 DNS、TLD、权威 DNS，缓存结果，减少重复查询。

---

## **28. Service Worker 如何拦截 HTTP 请求？**

✅ **考察点**：PWA、离线缓存。

✅ **示例回答**：
Service Worker 通过 `fetch` 事件拦截请求：

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

- **拦截请求**，返回缓存数据，减少网络请求。

---

## **29. 如何防止 HTTP 响应拆分攻击？**

✅ **考察点**：网络安全。

✅ **示例回答**：

1. **过滤换行符（`\n` & `\r`）**，避免恶意插入 HTTP 头部。
2. **使用 `Content-Length` 保护 HTTP 体**，防止插入攻击。

---

## **30. WebRTC 和 WebSocket 的区别？**

✅ **考察点**：实时通信。

✅ **示例回答**：
| 技术 | 传输协议 | 适用场景 |
|------|---------|---------|
| **WebSocket** | TCP | **客户端-服务器通信**，如聊天、推送 |
| **WebRTC** | UDP | **点对点通信**，如视频通话、P2P 文件传输 |

这里是 **5 道高频 MQTT 相关面试题**，涵盖 **MQTT 协议原理、QoS 机制、持久化会话、订阅主题、与 WebSocket 集成等** 深入考点。

---

## **31. MQTT 的 QoS（服务质量）级别有哪些？分别适用于哪些场景？**

✅ **考察点**：MQTT 消息传输可靠性。

✅ **示例回答**：
MQTT 提供 **三种 QoS 级别**，适用于不同场景：
| QoS 等级 | 描述 | 适用场景 |
|----------|----------------|------------------|
| **QoS 0** | 最多发送一次，不保证到达（At most once） | 适用于 **低延迟但不要求可靠性** 的场景，如传感器数据上传 |
| **QoS 1** | 至少发送一次，可能重复（At least once） | 适用于 **数据必须到达但允许重复** 的场景，如温湿度传感器状态 |
| **QoS 2** | 确保消息仅到达一次（Exactly once） | 适用于 **高可靠性要求** 的场景，如支付通知、订单状态更新 |

---

## **32. MQTT 如何保证消息的持久化和断线重连？**

✅ **考察点**：持久化会话、遗嘱消息（Last Will）。

✅ **示例回答**：
MQTT 通过 **持久化会话（Persistent Session）** 和 **遗嘱消息（Last Will Testament, LWT）** 确保消息在断线后仍能被处理：

1. **持久化会话（Clean Session = false）**：
   - 服务器存储 **订阅关系** 和 **未发送的 QoS 1/2 消息**，断线后重连仍能收到消息。
2. **遗嘱消息（Will Message）**：
   - 设备连接时注册 **遗嘱消息**，当客户端异常断开时，服务器自动向其他订阅者发送该消息。
   ```js
   client = mqtt.connect("mqtt://broker", {
     will: { topic: "device/status", payload: "offline", qos: 1, retain: true },
   });
   ```

---

## **33. MQTT 主题（Topic）和通配符（Wildcard）是如何工作的？**

✅ **考察点**：MQTT 主题匹配规则。

✅ **示例回答**：
MQTT 主题支持 **层级结构**，并提供 **两种通配符**：

1. **单层通配符（`+`）**：
   - 匹配单级主题。例如：
     - 订阅 `home/+/temperature`，可以接收：
       - `home/livingroom/temperature`
       - `home/bedroom/temperature`
2. **多层通配符（`#`）**：
   - 匹配多级主题。例如：
     - 订阅 `home/#`，可以接收：
       - `home/livingroom/temperature`
       - `home/kitchen/humidity`
       - `home/garden/light`

---

## **34. MQTT 如何与 WebSocket 结合使用？**

✅ **考察点**：MQTT over WebSocket。

✅ **示例回答**：
MQTT 可以通过 **WebSocket 传输**，实现 **前端页面和 MQTT 服务器的双向通信**。

### **示例代码（基于 `mqtt.js` 库）**

```js
import mqtt from "mqtt";

// 通过 WebSocket 连接 MQTT 服务器
const client = mqtt.connect("ws://broker.hivemq.com:8000/mqtt");

// 订阅主题
client.on("connect", () => {
  console.log("Connected to MQTT over WebSocket");
  client.subscribe("sensor/data");
});

// 接收消息
client.on("message", (topic, message) => {
  console.log(`Received: ${topic} - ${message.toString()}`);
});
```

✅ **应用场景**：

- **实时数据监控**（IoT 设备数据可视化）。
- **前端 Web 应用直接与 MQTT 服务器通信**（无需额外 API）。

---

## **35. 如何实现 MQTT 负载均衡和高可用性？**

✅ **考察点**：MQTT 集群、负载均衡策略。

✅ **示例回答**：
MQTT 服务器通常使用 **集群（Cluster）+ 负载均衡（Load Balancing）** 实现高可用性：

1. **EMQX / Mosquitto 集群**：
   - 采用 **多节点部署**，支持 **水平扩展** 和 **状态同步**。
2. **负载均衡方案**：
   - **DNS 轮询**（多个 MQTT 服务器的 DNS 解析到不同 IP）。
   - **反向代理（Nginx / HAProxy）**：
     ```nginx
     upstream mqtt_servers {
         server 192.168.1.101:1883;
         server 192.168.1.102:1883;
     }
     ```
   - **MQTT Broker 自带的负载均衡**（如 EMQX 内置的 **桥接模式** 允许服务器之间同步消息）。

---

## **36. cookie、session 和 localStorage 的区别？**

✅ **考察点**：浏览器存储机制。

✅ **示例回答**：

- **cookie**：5m 左右，存储的数据是永久性的，除非用户人为删除否则会一直存在。

  - 使用场景：登录网站，第一天输入用户名密码登录了，第二天再打开很多情况下就直接打开了。这个时候用到的一个机制就是 cookie。cookie 通过 set-cookie 设置，下次请求会自动带上。cookie 属性：max-age/ expires/ domain/ secure(这个 cookie 只有在 https 的时候才会发送)?

- **session**：5m 左右，存储的数据是临时性的，当浏览器关闭时会消失。

  - 使用场景：购物车，添加了商品之后客户端处可以知道添加了哪些商品，而服务器端如何判别呢，所以也需要存储一些信息就用到了 session。session 维护在服务器中，依赖于 cookie，随着浏览器发起请求，随着 cookie 发送到服务端。区别：cookie 存在客户端，session 存在服务端域支持的范围不一样，a.com 的 cookie 在 api.a.com 下能用，但是 session 不行。

- **localStorage**：5m 左右，存储的数据是永久性的，除非用户人为删除否则会一直存在。

  - **同域名下共享**：统一域名下共享一个 localStorage，a.meituan.com 和 b.meituan.com 是两个域名，不能共享。

  - **同 webview 下共享**：在 webview 中打开一个页面：i.meituan.com/home.html，点击一个按钮，调用 js 桥打开一个新的 webview：i.meituan.com/list.html，这两个分属不同 webview 的页面能共享同一个 localStorage 吗？可以共享，相当于同一个浏览器的不同标签页，不同浏览器不能共享。

  - **存满了**：如果 localStorage 存满了，再往里存东西，或者要存的东西超过了剩余容量，会发生什么？怎么办？存不进去并报错，解决，首先我们在工程初步架构的时候就应该避免这样的问题，划分域名，单页配备单一域名，业务数据用 localStorage，文件类型就 indexDB 存了，那如果不可避免的话，我们存的时候需要为每个存的值设置时间戳，然后自己做一个 LRU 算法，存入时间最久、近期最少使用的就干掉再存。

---

## **37. 缓存**

✅ **考察点**：HTTP 缓存机制。

✅ **示例回答**：

资源的回包 header 里会有 `cache-control/expires/etag/last-modified` 等字段。

```
Response Headers
accept-ranges: bytes
access-control-allow-origin: \*
age: 0
cache-control: max-age=600
content-encoding: gzip
content-length: 761
content-type: application/javascript; charset=utf-8
date: Wed, 28 Oct 2020 07:38:48 GMT
etag: W/"5dcfa549-7a8"
expires: Wed, 28 Oct 2020 06:53:35 GMT
last-modified: Sat, 16 Nov 2019 07:29:13 GMT
server: GitHub.com
status: 304
vary: Accept-Encoding
via: 1.1 varnish
x-cache: MISS
x-cache-hits: 0
x-fastly-request-id: a3fd5490ff6f25c7a76a04c0be85be0b8f5f3e0e
x-github-request-id: F8CE:214D:1DCAFD4:1F7CBFE:5F96CBF7
x-proxy-cache: MISS
x-served-by: cache-hnd18721-HND
x-timer: S1603870728.487443,VS0,VE309
```

请求头里有 `if-modified-since/if-none-match`。

```http
:authority: fecommunity.github.io
:method: GET
:path: /front-end-interview/gitbook/gitbook-plugin-donate/plugin.js
:scheme: https
accept: _/_
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.9,en;q=0.8
if-modified-since: Sat, 16 Nov 2019 07:29:13 GMT
if-none-match: W/"5dcfa549-7a8"
referer: https://fecommunity.github.io/front-end-interview/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/9.%E7%BC%93%E5%AD%98.html
sec-fetch-dest: script
sec-fetch-mode: no-cors
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36
```

---

## **39. 单点登录的三种方式**

1. **父域 Cookie**：tieba.baidu.com 和 map.baidu.com 可共用 .baidu.com 父域的 cookie，达到共用登录态，但是不支持跨主域。

2. **iframe**：A 域登陆成功后，生成 iframe 标签，请求 src，将要传递的 cookie 放到 url 中携带过去，src 路径为 B 域，B 域解析 URL，将传过来的信息保存，就可以共享登录态了。

3. **Token**：A 域登陆成功后，生成 token，token 保存在 A 域 Cookie 中，然后将 token 传递给 B 域，B 域拿到 token 后，验证 token 是否合法，合法则共享登录态。

---

## **40. GET 和 POST 的区别**

- **参数传递**：GET 把参数包含在 URL 中，POST 通过 request body 传递参数。
- **历史记录**：GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
- **数据长度限制**：GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有限制。
- **数据类型限制**：GET 只接受 ASCII 字符，而 POST 没有限制。
