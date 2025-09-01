import { request } from "../utils/request";

// 获取分类精选列表
export function getCategoryListApi(data = {}) {
  return request({
    url: "/classify",
    data: data,
  });
}

// 获取指定分类下的图片列表
export function getCateDetailListApi(data = {}) {
  return request({
    url: "/wallList",
    data: data,
  });
}
