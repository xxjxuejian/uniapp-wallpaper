<template>
  <view class="userItem">
    <view class="left">
      <uni-icons :type="icon" size="20"></uni-icons>
      <text class="title">{{ title }}</text>
    </view>

    <slot name="right">
      <view class="right">
        <view v-if="count" class="text">{{ count }}</view>
        <uni-icons type="right" size="15" color="#aaa"></uni-icons>
      </view>
    </slot>
    <!-- #ifdef MP -->
    <button v-if="isContact" open-type="contact" class="contact-btn">
      联系客服
    </button>
    <!-- #endif -->
    <!-- #ifndef MP -->
    <button v-if="isContact" @click.stop="handleContact" class="contact-btn">
      拨打电话
    </button>
    <!-- #endif -->
  </view>
</template>

<script setup>
const props = defineProps({
  // uni-icons图标
  icon: {
    type: String,
    default: "contact",
  },
  // 标题
  title: {
    type: String,
    default: "我的下载",
  },
  count: {
    type: Number,
    default: 0,
  },
  //当前项是否是联系客服按钮
  isContact: {
    type: Boolean,
    default: false,
  },
});

const handleContact = () => {
  uni.makePhoneCall({
    phoneNumber: "13965267584", //仅为示例
  });
};
</script>

<style lang="scss" scoped>
.userItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  height: 100rpx;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  position: relative;

  .left {
    display: flex;
    align-items: center;
    // 在h5中uni-icons类是直接在加这个元素上的，但是在微信中，uni-icons类是该元素内部的一个元素上的，所以选不中
    :deep() {
      .uni-icons {
        color: $brand-theme-color !important;
      }
    }

    .title {
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

  .contact-btn {
    position: absolute;
    top: 0;
    left: 0;
    height: 100rpx;
    width: 100%;
    opacity: 0;
  }
}
</style>
