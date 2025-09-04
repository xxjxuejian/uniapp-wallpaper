<template>
  <view class="noticeLayout">
    <view class="title">
      <view class="tag" v-if="detail.select">
        <uni-tag inverted text="置顶" type="error" />
      </view>
      <view class="font">{{ detail.title }}</view>
    </view>

    <view class="info">
      <view class="item">{{ detail.author }}</view>
      <view class="item">
        <uni-dateformat
          :date="detail.publish_date"
          format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
      </view>
    </view>

    <view class="content">
      <!-- 插件市场的富文本组件 -->
      <mp-html :content="detail.content" />
      <!-- uniapp提供的富文本 -->
      <!-- <rich-text :nodes="detail.content"></rich-text> -->
    </view>

    <view class="count">阅读 {{ detail.view_count }}</view>
  </view>
</template>

<script setup>
import { getNoticeDetailApi } from "@/api/home.js";

const detail = ref({}); // 通知详情
let noticeId; // 通知id

async function getNoticeDetail(id) {
  const res = await getNoticeDetailApi({
    id: id,
  });
  // 加入 res.data是一个对象，那么 detail.value = res.data; 和  Object.assign(detail.value,res.data)的区别是什么
  console.log("通知详情", res);
  // Object.assign(detail.value, res.data);
  detail.value = res.data;
}

onLoad((e) => {
  noticeId = e.id;
  if (noticeId) {
    getNoticeDetail(noticeId);
  }
});
</script>

<style lang="scss" scoped>
.noticeLayout {
  padding: 30rpx;
  .title {
    font-size: 40rpx;
    color: #111;
    line-height: 1.6em;
    padding-bottom: 30rpx;
    display: flex;
    .tag {
      transform: scale(0.8);
      transform-origin: left center;
      flex-shrink: 0;
    }
    .font {
      padding-left: 6rpx;
    }
  }
  .info {
    display: flex;
    align-items: center;
    color: #999;
    font-size: 28rpx;
    .item {
      padding-right: 20rpx;
    }
  }
  .content {
    padding: 50rpx 0;
  }
  .count {
    color: #999;
    font-size: 28rpx;
  }
}
</style>
