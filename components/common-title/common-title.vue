<template>
  <view>
    <view class="common-title">
      <view class="name">
        <slot name="name">
          <text>默认标题</text>
        </slot>
      </view>
      <view class="custom">
        <slot name="custom">
          <text>More+</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script></script>

<style lang="scss">
.common-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  .name {
    font-size: 40rpx;
  }
}
</style>
