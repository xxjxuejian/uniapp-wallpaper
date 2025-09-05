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

// 获取每日精选列表,随机9张图
export function getDailySelectListApi() {
  return request({
    url: "/randomWall",
  });
}

// 获取每日精选/分类精选/其它的每一张图的详情
export function getImageDetailApi(data = {}) {
  return request({
    url: "/detailWall",
    data,
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

// 给图片评分
export function setImageScoreApi(data = {}) {
  return request({
    url: "/setupScore",
    data,
  });
}

// 获取通知公告详情
export function getNoticeDetailApi(data = {}) {
  return request({
    url: "/wallNewsDetail",
    data,
  });
}

// 壁纸下载
export function downloadPicApi(data = {}) {
  return request({
    url: "/downloadWall",
    data,
  });
}
