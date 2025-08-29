<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
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
</style>
