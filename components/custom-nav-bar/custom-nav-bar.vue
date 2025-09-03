<template>
  <!-- 这个顶部的搜索导航需要和小程序中的胶囊按钮 同一行；而且页面滚动时，始终在顶部 -->
  <view class="custom-nav-bar">
    <view class="navbar">
      <!-- 顶部状态栏 -->
      <view
        class="statusBar"
        :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="titleBar" :style="{ height: titleBarHeight + 'px' }">
        <view class="title">{{ title }}</view>
        <navigator url="/pages/search/index" class="search">
          <uni-icons
            class="icon"
            type="search"
            color="#888"
            size="18"></uni-icons>
          <text class="text">搜索</text>
        </navigator>
      </view>
    </view>

    <!-- 由于 navbar设置了fiexd定位，导致父元素高度塌陷，需要用这个盒子撑开-->
    <view
      class="placeHolder"
      :style="{ height: statusBarHeight + titleBarHeight + 'px' }"></view>
  </view>
</template>

<script setup>
import { useSystemInfo } from "@/utils/system.js";

const { statusBarHeight, titleBarHeight } = useSystemInfo();

defineProps({
  title: {
    type: String,
    default: "默认标题",
  },
});
</script>

<style lang="scss" scoped>
.custom-nav-bar {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    background: linear-gradient(to bottom, transparent, #fff 400rpx),
      linear-gradient(to right, #beecd8 20%, #f4e2d8);

    .statusBar {
      // background-color: #00ff00;
    }
    .titleBar {
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      // background-color: red;

      .title {
        font-size: 22px;
        font-weight: 700;
        color: $text-font-color-1;
      }
      .search {
        width: 220rpx;
        height: 50rpx;
        border-radius: 60rpx;
        background: rgba(255, 255, 255, 0.4);
        // border: 1px solid #fff;
        margin-left: 30rpx;
        color: #999;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        .icon {
          margin-left: 5rpx;
        }
        .text {
          padding-left: 10rpx;
        }
      }
    }
  }
}
</style>
