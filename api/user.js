import { request } from "../utils/request";

// 登录用户获取我的评分,我的下载中的壁纸列表
export function getUserHisListApi(data = {}) {
  return request({
    url: "/userWallList",
    data,
  });
}

// 获取用户信息
export function getUserInfoApi() {
  return request({
    url: "/userInfo",
  });
}
