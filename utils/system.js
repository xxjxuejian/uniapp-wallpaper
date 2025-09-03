export function useSystemInfo() {
  // 系统信息
  const systemInfo = uni.getSystemInfoSync();
  // 状态栏高度（所有端都有）
  const statusBarHeight = ref(systemInfo.statusBarHeight || 15);
  // 标题栏高度（不同端不同逻辑）
  const titleBarHeight = ref(40); // 默认一个常见值
  let menuButtonInfo = null;

  // 根据文档，在App与H5，没有该API getMenuButtonBoundingClientRect
  // #ifdef MP
  try {
    menuButtonInfo = uni.getMenuButtonBoundingClientRect();
    titleBarHeight.value =
      menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2;
  } catch (e) {
    console.warn("获取胶囊信息失败：", e);
  }
  // #endif

  // #ifndef MP
  // H5/App 没有胶囊按钮，通常导航栏高度固定，可以按 UI 设计稿调整
  titleBarHeight.value = 40;
  // #endif

  // const topPlaceHolderHeight = statusBarHeight.value + titleBarHeight.value;

  return {
    systemInfo,
    menuButtonInfo,
    statusBarHeight,
    titleBarHeight,
  };
}
