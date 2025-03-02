// 读取日志内容
let log = $persistentStore.read("shadowrocket_log"); // 这里假设日志存储在 $persistentStore 中
if (!log) {
    $notification.post("Shadowrocket 状态", "", "未找到日志文件");
    $done();
}

// 解析越狱状态
let jailbreakMatch = log.match(/jailbroken\s*=>\s*(\d)/);
let jailbreakStatus = jailbreakMatch ? (jailbreakMatch[1] === "1" ? "设备：已越狱" : "设备：未越狱") : "设备：未知";

// 解析全局路由状态
let routingMatch = log.match(/global routing\s*=>\s*(\w+)/);
let routingStatus = routingMatch ? `全局路由：${routingMatch[1]}` : "全局路由：未知";

// 解析 HTTPS 解密状态
let mitmStatus = "未开启 HTTPS 解密";
if (log.includes("mitm")) {
    let certMatch = log.match(/mitm cert trusted\s*=>\s*(\d)/);
    mitmStatus = certMatch ? (certMatch[1] === "1" ? "证书已信任" : "证书未信任") : "HTTPS 解密状态未知";
}

// 解析规则、脚本、重写数量
let ruleMatch = log.match(/rule summary\s*=>\s*(.*)/);
let ruleSummary = ruleMatch ? `规则数量：${ruleMatch[1]}` : "规则数量：未知";

let scriptMatch = ruleMatch ? ruleMatch[1].match(/script:(\d+)/) : null;
let scriptCount = scriptMatch ? `脚本数量：${scriptMatch[1]}` : "脚本数量：未知";

let rewriteMatch = ruleMatch ? ruleMatch[1].match(/url-rewrite:(\d+)/) : null;
let rewriteCount = rewriteMatch ? `重写数量：${rewriteMatch[1]}` : "重写数量：未知";

// 解析代理模式
let proxyMode = "代理模式：未知";
if (log.includes("network setup http proxy mode")) {
    proxyMode = "代理模式：HTTP 代理";
} else if (log.includes("network setup tun only mode")) {
    proxyMode = "代理模式：TUN 模式";
}

// 组合通知内容
let result = `${jailbreakStatus}\n${routingStatus}\n${mitmStatus}\n${ruleSummary}\n${scriptCount}\n${rewriteCount}\n${proxyMode}`;

// 显示通知
$notification.post("Shadowrocket 状态", "", result);

// 结束脚本
$done();