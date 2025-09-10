<script>
import Track from "@/utils/track";
import { downloadPicApi } from "@/api/home.js";

// 埋点函数映射表
const apiMap = {
  downloadPicApi,
};

export default {
  onLaunch: function () {
    console.log("App Launch");
    // 补发本地缓存的埋点
    Track.flushReports(apiMap);
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css样式,全局class可以在这里导入 */
@import "@/common/styles/reset.scss";
@import "@/common/styles/utilities.scss";
// 自定义的图标，从iconfont上下载的
@import "@/static/iconfont.css";
</style>
