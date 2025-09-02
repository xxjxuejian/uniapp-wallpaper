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
      <view class="section">
        <navigator
          url="/pages/category-detail/index?name=我的下载&type=download">
          <user-item icon="download-filled" title="我的下载"></user-item>
        </navigator>
        <navigator url="/pages/category-detail/index?name=我的评分&type=score">
          <user-item icon="star-filled" title="我的评分"></user-item>
        </navigator>
        <navigator url="/pages/funny/index">
          <user-item icon="image-filled" title="梗图集"></user-item>
        </navigator>
      </view>

      <view class="section">
        <navigator url="/pages/notice/index">
          <user-item icon="notification-filled" title="订阅更新"></user-item>
        </navigator>
        <navigator url="/pages/notice/index">
          <user-item icon="flag-filled" title="常见问题"></user-item>
        </navigator>

        <user-item
          icon="chatboxes-filled"
          title="联系客服"
          :is-contact="true"></user-item>

        <navigator url="/pages/notice/index">
          <user-item icon="chatboxes-filled" title="反馈建议"></user-item>
        </navigator>
      </view>

      <view class="section">
        <user-item icon="gear-filled" title="退出登录">
          <template #right>
            <view class="right">
              <view class="text">退出当前账号</view>
            </view>
          </template>
        </user-item>
      </view>
    </view>
  </view>
</template>

<script setup>
const userInfo = ref(null);

const handleLogout = () => {
  console.log("退出登录");
};
</script>

<style lang="scss" scoped>
.user {
  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50rpx 0;

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

      .right {
        .text {
          font-size: 28rpx;
          color: #aaa;
        }
      }
    }
  }
}
</style>
