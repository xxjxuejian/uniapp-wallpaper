import { request } from "../utils/request";

// 获取分类精选列表
export function getCategoryListApi(data = {}) {
  return request({
    url: "/classify",
    data: data,
  });
}
