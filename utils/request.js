const BASE_URL = "https://tea.qingnian8.com/api/bizhi";
const ACCESS_KEY = "xxj9824";

export function request(config = {}) {
  let { url, data = {}, method = "GET", header = {} } = config;

  // 这里可以在其它项目中获取token等前置操作
  if (ACCESS_KEY) {
    header["access-key"] = ACCESS_KEY;
  }
  // 可以加入加载动画,很多个网络请求都会触发这个，就有多个加载动画，怎么解决呢
  // uni.showLoading({
  //   title: "加载中...",
  //   mask: true,
  // });

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      timeout: 10000,
      success: (res) => {
        // uni.hideLoading(); //请求完成，隐藏加载动画
        if (res.statusCode === 200) {
          const data = res.data;
          // data内部结构是后端定义的了
          if (data.errCode === 0) {
            resolve(data);
          } else if (data.errCode === 400) {
            uni.showModal({
              title: "错误提示",
              content: data.errMsg,
              showCancel: false,
            });
            reject(res.data);
          } else {
            uni.showToast({
              title: data.errMsg,
              icon: "none",
            });
            reject(res.data);
          }
        }
      },
      fail: (err) => {
        // uni.hideLoading(); //请求失败，隐藏加载动画
        reject(err);
      },
    });
  });
}
