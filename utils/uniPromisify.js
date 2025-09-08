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
