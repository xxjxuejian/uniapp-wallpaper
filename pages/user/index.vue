<template>
  <view class="user pageBg">
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
      <view class="section" v-for="i in 3">
        <view class="row">
          <view class="left">
            <uni-icons type="download-filled" size="20"></uni-icons>
            <view class="text">我的下载</view>
          </view>
          <view class="right">
            <uni-icons type="right" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
        <view class="row">
          <view class="left">
            <uni-icons type="download-filled" size="20"></uni-icons>
            <view class="text">我的评分</view>
          </view>
          <view class="right">
            <uni-icons type="right" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
        <view class="row">
          <view class="left">
            <uni-icons type="download-filled" size="20"></uni-icons>
            <view class="text">梗图集</view>
          </view>
          <view class="right">
            <uni-icons type="right" size="15" color="#aaa"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const userInfo = ref(null);
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
      // margin-bottom: 50rpx;
      border: 1px solid #eee;
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
        &:last-child {
          border-bottom: none;
        }

        .left {
          display: flex;
          align-items: center;
          .uni-icons {
            color: $brand-theme-color !important;
          }

          /* #ifdef MP-WEIXIN */
          uni-icons {
            .uni-icons {
              color: $brand-theme-color !important;
            }
          }
          /* #endif */

          // :deep() {
          //   .uni-icons {
          //     color: $brand-theme-color !important;
          //   }
          // }
          .text {
            margin-left: 20rpx;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
