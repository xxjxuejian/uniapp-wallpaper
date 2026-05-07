// 埋点上报工具函数;
const STORAGE_KEY = "pendingReports";

/**
 * 判断错误是否可恢复
 * 区分「可恢复错误」和「不可恢复错误」
 * 可恢复的才缓存并补发，不可恢复的直接丢弃
 * 根据实际的后端业务逻辑写，这里只是一个示例代码，并且在sendReport中没有使用这个函数
 * @param {Object} err
 */
function isRetryableError(err) {
  if (!err) return false;

  // uni.request 网络错误
  if (err.errMsg && err.errMsg.includes("request:fail")) {
    return true;
  }

  // HTTP 状态码
  if (err.statusCode) {
    if (err.statusCode >= 500) return true; // 服务端错误
    if (err.statusCode === 429) return true; // 接口限流
    return false; // 4xx 大部分是参数错误或权限问题，不缓存
  }

  return false; // 默认不可恢复
}

// 上报埋点的核心函数，apiFn就是埋点上报接口
// 埋点上报函数可能调用失败，这里进行失败重试，再次失败就把当前的上报函数保存到本地，等合适的时候，再次上报
async function sendReport(apiFn, params) {
  try {
    await apiFn(params); // 第一次尝试
  } catch (err) {
    // 判断是否为 可恢复失败
    if (isRetryableError(err)) {
      console.warn("埋点上报失败，准备重试...", err);
      try {
        await apiFn(params); // 重试一次
      } catch (err2) {
        console.error("埋点重试失败，缓存到本地", err2);
        // 缓存的结构是一个对象 {
        // apiFnName : fnName,
        // params : {....}
        // }
        // 这里仅仅缓存了函数名称，没有实际的函数体，也没办法通过setStorageSync缓存函数本身
        cacheReport({ apiFnName: apiFn.name, params });
      }
    } else {
      console.error(`[埋点] 不可恢复失败，丢弃: ${apiFn.name}`, err);
    }
  }
}

// 缓存失败的埋点（存到本地）
function cacheReport(data) {
  // reports是一个数组，保存了所有上报失败的埋点函数
  const reports = uni.getStorageSync(STORAGE_KEY) || [];
  reports.push({ ...data, time: Date.now() });
  uni.setStorageSync(STORAGE_KEY, reports);
}

// 重新发送缓存的埋点
async function flushReports(apiMap) {
  const reports = uni.getStorageSync(STORAGE_KEY) || [];
  console.log("埋点 reports", reports);
  if (!reports.length) return;

  const remain = []; // 本次重发中 再次失败的埋点函数
  for (const item of reports) {
    // item的结构：{ apiFnName: apiFn.name, params }
    const apiFn = apiMap[item.apiFnName];
    // 在映射表中找不到对应的函数，
    if (!apiFn) {
      console.warn(`[埋点] 找不到接口: ${item.apiFnName}`);
      remain.push(item);
      continue;
    }

    try {
      await apiFn(item.params);
      console.log(`[埋点] 补发成功: ${item.apiFnName}`);
    } catch (err) {
      console.warn(`[埋点] 补发失败，保留缓存: ${item.apiFnName}`, err);
      remain.push(item);
    }
  }

  // 重新保存当前失败的埋点函数
  uni.setStorageSync(STORAGE_KEY, remain);
}

/**
 * 自动定时补发
 * @param {Object} apiMap { apiName: fn }
 * @param {number} interval 补发间隔，毫秒
 */
function startAutoFlush(apiMap, interval = 30000) {
  setInterval(() => {
    flushReports(apiMap);
  }, interval);
}

export default {
  sendReport,
  flushReports,
  startAutoFlush,
};
