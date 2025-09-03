<template>
  <view class="user pageBg">
    <!-- 占位盒子 -->
    <view :style="{ height: statusBarHeight + titleBarHeight + 'px' }"></view>
    <!-- 用户信息 -->
    <view class="user-info">
      <view class="avatar">
        <image src="../../static/images/xxmLogo.png" mode="aspectFill"></image>
      </view>
      <view class="info">
        <view class="name">点击登录</view>
      </view>
    </view>

    <view class="content">
      <view class="section">
        <navigator
          url="/pages/category-detail/index?name=我的下载&type=download">
          <view class="row">
            <view class="left">
              <uni-icons type="download-filled" size="20"></uni-icons>
              <view class="text">我的下载</view>
            </view>
            <view class="right">
              <view class="text">2</view>
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
        <navigator url="/pages/category-detail/index?name=我的评分&type=score">
          <view class="row">
            <view class="left">
              <uni-icons type="star-filled" size="20"></uni-icons>
              <view class="text">我的评分</view>
            </view>
            <view class="right">
              <view class="text">21</view>
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
        <navigator url="/pages/funny/index">
          <view class="row">
            <view class="left">
              <uni-icons type="image-filled" size="20"></uni-icons>
              <view class="text">梗图集</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
      </view>

      <view class="section">
        <navigator url="/pages/notice/index">
          <view class="row">
            <view class="left">
              <uni-icons type="notification-filled" size="20"></uni-icons>
              <view class="text">订阅更新</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
        <navigator url="/pages/notice/index">
          <view class="row">
            <view class="left">
              <uni-icons type="flag-filled" size="20"></uni-icons>
              <view class="text">常见问题</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
        <view class="row">
          <view class="left">
            <uni-icons type="chatboxes-filled" size="20"></uni-icons>
            <view class="text">联系客服</view>
          </view>
          <view class="right">
            <uni-icons type="right" size="15" color="#aaa"></uni-icons>
          </view>

          <!-- #ifdef MP -->
          <button open-type="contact" class="contact-btn">联系客服</button>
          <!-- #endif -->
          <!-- #ifndef MP -->
          <button @click="handleContact" class="contact-btn">拨打电话</button>
          <!-- #endif -->
        </view>
        <navigator url="/pages/notice/index">
          <view class="row">
            <view class="left">
              <uni-icons type="chatboxes-filled" size="20"></uni-icons>
              <view class="text">反馈建议</view>
            </view>
            <view class="right">
              <uni-icons type="right" size="15" color="#aaa"></uni-icons>
            </view>
          </view>
        </navigator>
      </view>

      <view class="section">
        <view class="row" @click="handleLogout">
          <view class="left">
            <uni-icons type="gear-filled" size="20"></uni-icons>
            <view class="text">退出登录</view>
          </view>
          <view class="right">
            <view class="text">退出当前账号</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useSystemInfo } from "@/utils/system.js";
const { statusBarHeight, titleBarHeight } = useSystemInfo();
const userInfo = ref(null);

const handleLogout = () => {
  console.log("退出登录");
};

// 非小程序中联系客服是拨打电话;或者是展示一张客服微信的二维码
const handleContact = () => {
  uni.makePhoneCall({
    phoneNumber: "13965267584", //仅为示例
  });
};
</script>

<style lang="scss" scoped>
.user {
  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50rpx 0;
    // background-color: lightblue;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      padding: 20rpx 0;
      .name {
        font-size: 44rpx;
        color: #333;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 50rpx 0;
    width: 690rpx;
    margin: 0 auto;
    padding-bottom: 50rpx;

    .section {
      width: 100%;
      border: 1px solid #eee;
      border-bottom: none;
      border-radius: 10rpx;
      box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);
      overflow: hidden;

      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        height: 100rpx;
        border-bottom: 1px solid #eee;
        background-color: #fff;
        position: relative;

        .contact-btn {
          position: absolute;
          top: 0;
          left: 0;
          height: 100rpx;
          width: 100%;
          opacity: 0;
        }

        .left {
          display: flex;
          align-items: center;

          // 针对微信小程序的图标颜色修改,同样适用H5
          :deep() {
            .uni-icons {
              color: $brand-theme-color !important;
            }
          }
          .text {
            margin-left: 20rpx;
            color: #666;
          }
        }
        .right {
          display: flex;
          align-items: center;
          gap: 8rpx;
          .text {
            font-size: 28rpx;
            color: #aaa;
          }
        }
      }

      // navigator:last-child .row {
      //   border-bottom: none;
      // }
    }
  }
}
</style>
