import { request } from "../utils/request";

// 首页获取banner
export function getHomeBannerApi() {
  return request({
    url: "/homeBanner",
    method: "get",
  });
}
