// 获取图片信息
export function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: resolve,
      fail: reject,
    });
  });
}

// 保存图片到相册
export function saveImageToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    uni.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: reject,
    });
  });
}

// 打开设置
export function openSetting() {
  return new Promise((resolve, reject) => {
    uni.openSetting({
      success: resolve,
    });
  });
}

// 显示模态窗
export function showModal(options) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      ...options,
      success: resolve,
    });
  });
}

// 请求权限
async function requestPermission() {
  const modalRes = await showModal({
    title: "授权提示",
    content: "需要授权保存相册",
  });
  if (!modalRes.confirm) {
    uni.showToast({ title: "拒绝授权", icon: "none" });
    return false;
  }
  const setting = await openSetting();
  if (setting.authSetting["scope.writePhotosAlbum"]) {
    uni.showToast({ title: "获取授权成功", icon: "none" });
    return true;
  } else {
    uni.showToast({ title: "获取权限失败", icon: "none" });
    return false;
  }
}
