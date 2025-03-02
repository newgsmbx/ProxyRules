(function() {
  // 从 $argument 获取日志内容（确保调用时传入日志文本）
  var log = $argument;
  if (!log) {
    $notification.post("Shadowrocket 状态", "", "未提供日志内容");
    $done();
  }

  // 解析越狱状态
  var jailMatch = log.match(/jailbroken\s*=>\s*(\d)/);
  var jailbreakStatus = "设备：未知";
  if (jailMatch) {
    jailbreakStatus = (jailMatch[1] === "1") ? "设备：已越狱" : "设备：未越狱";
  }
  
  // 解析全局路由状态
  var routingMatch = log.match(/global routing\s*=>\s*(\w+)/);
  var routingStatus = routingMatch ? "全局路由：" + routingMatch[1] : "全局路由：未知";
  
  // 解析 HTTPS 解密状态及证书信任情况
  var mitmStatus = "";
  if (log.indexOf("mitm") === -1) {
    mitmStatus = "未开启 HTTPS 解密";
  } else {
    var certMatch = log.match(/mitm cert trusted\s*=>\s*(\d)/);
    if (certMatch) {
      mitmStatus = (certMatch[1] === "1") ? "证书已信任" : "证书未信任";
    } else {
      mitmStatus = "HTTPS 解密状态未知";
    }
  }
  
  // 解析规则摘要（包括规则、脚本、重写数量）
  var ruleMatch = log.match(/rule summary\s*=>\s*(.*)/);
  var ruleSummary = ruleMatch ? ruleMatch[1] : "未知";
  
  // 从规则摘要中提取脚本数量
  var scriptMatch = ruleSummary.match(/script:(\d+)/);
  var scriptCount = scriptMatch ? scriptMatch[1] : "未知";
  
  // 提取重写数量
  var rewriteMatch = ruleSummary.match(/url-rewrite:(\d+)/);
  var rewriteCount = rewriteMatch ? rewriteMatch[1] : "未知";
  
  // 解析代理模式
  var proxyMode = "代理模式：未知";
  if (log.indexOf("network setup http proxy mode") !== -1) {
    proxyMode = "代理模式：HTTP代理";
  } else if (log.indexOf("network setup tun only mode") !== -1) {
    proxyMode = "代理模式：TUN模式";
  }
  
  // 组合最终通知内容
  var result = jailbreakStatus + "\n" +
               routingStatus + "\n" +
               mitmStatus + "\n" +
               "规则数量：" + ruleSummary + "\n" +
               "脚本数量：" + scriptCount + "\n" +
               "重写数量：" + rewriteCount + "\n" +
               proxyMode;
               
  // 发送通知
  $notification.post("Shadowrocket 状态", "", result);
  $done();
})();
