import { request } from "../utils/request";

// 首页获取banner
export function getHomeBannerApi() {
  return request({
    url: "/homeBanner",
    method: "get",
  });
}

// 获取通知列表
export function getNoticeListApi() {
  return request({
    url: "/wallNewsList",
  });
}

// 获取每日精选列表
export function getDailySelectListApi() {
  return request({
    url: "/randomWall",
  });
}

// 获取分类精选列表
export function getCategorySelectListApi(data = {}) {
  return request({
    url: "/classify",
    data: data,
  });
}

// 获取专题精选列表
export function getTopicSelectListApi() {
  return request({
    url: "/subjectList",
  });
}
