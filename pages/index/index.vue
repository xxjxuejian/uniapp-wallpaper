<template>
  <view class="home pageBg">
    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
        :interval="3000"
        autoplay
        circular>
        <swiper-item v-for="item in bannerList" :key="item._id">
          <!-- 跳转到其它小程序 -->
          <navigator
            v-if="item.target === 'miniProgram'"
            target="miniProgram"
            :app-id="item.appid"
            class="link">
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>

          <!-- 页面跳转,跳转到特定的分类页
					 item.url: "id=6524a48f6523417a8a8b825d&name=可爱萌宠"
					 -->
          <navigator
            v-else
            :url="`/pages/category-detail/index?${item.url}`"
            class="link">
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>

    <view class="notice">
      <view class="left flex-center">
        <uni-icons type="sound-filled" size="20"></uni-icons>
        <text class="text">公告</text>
      </view>
      <view class="middle">
        <swiper vertical autoplay :interval="2000" circular>
          <swiper-item v-for="item in noticeList" :key="item._id">
            <!-- 跳转页面并传递参数 -->
            <navigator
              :url="'/pages/notice/detail?id=' + item._id"
              class="single-ellipsis">
              {{ item.title }}
            </navigator>
          </swiper-item>
        </swiper>
      </view>
      <view class="right flex-center">
        <uni-icons type="right" size="16" color="#333"></uni-icons>
      </view>
    </view>

    <!-- 每日优选推荐 -->
    <view class="daily-select">
      <common-title>
        <template #name>每日推荐</template>
        <template #custom>
          <view class="change">
            <uni-icons type="loop" size="18" color="#000"></uni-icons>
            <text class="text">换一换</text>
          </view>
        </template>
      </common-title>
      <!-- 推荐图片 -->
      <view class="select-list">
        <scroll-view scroll-x="true">
          <view
            class="item"
            v-for="item in dailySelectList"
            :key="item._id"
            @click="handlePreview(item._id)">
            <image :src="item.smallPicurl" mode="aspectFill"></image>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 分类精选 -->
    <view class="category-select">
      <common-title>
        <!-- 分类页 url:/pages/category/index -->
        <template #name>分类精选</template>
        <template #custom>
          <navigator
            url="/pages/category/index"
            open-type="reLaunch"
            class="more">
            More+
          </navigator>
        </template>
      </common-title>
      <view class="category-list">
        <category-item
          v-for="item in categorySelectList"
          :key="item._id"
          :item="item"></category-item>
        <category-item :isMore="true"></category-item>
      </view>
    </view>

    <!-- 专题精选 -->
    <view class="topic-select">
      <common-title>
        <!-- 专题页  -->
        <template #name>专题精选</template>
        <template #custom>
          <navigator url="" open-type="reLaunch" class="more">More+</navigator>
        </template>
      </common-title>
    </view>
  </view>
</template>

<script setup>
import {
  getHomeBannerApi,
  getNoticeListApi,
  getDailySelectListApi,
  getCategorySelectListApi,
} from "@/api/home.js";

const bannerList = ref([]); //轮播列表
const noticeList = ref([]); // 通知列表
const dailySelectList = ref([]); // 每日精选列表
const categorySelectList = ref([]); // 分类精选列表
const topicSelectList = ref([]); //专题精选列表

// 获取轮播图banner
function getHomeBanner() {
  getHomeBannerApi().then((res) => {
    bannerList.value = res.data;
    console.log("轮播图", bannerList.value);
  });
}
getHomeBanner();

// 获取通知公告
function getNoticeList() {
  getNoticeListApi().then((res) => {
    noticeList.value = res.data;
    // console.log("notice", noticeList.value);
  });
}
getNoticeList();

// 获取每日推荐
function getDailySelectList() {
  getDailySelectListApi().then((res) => {
    console.log("DailySelect", res);
    dailySelectList.value = res.data;
  });
}
getDailySelectList();

// 跳转到预览页面
const handlePreview = (id) => {
  // 保存到本地存储中，后续使用
  // uni.setStorageSync("storgClassList", dailySelectList.value);

  // 跳转非 tabBar 的页面的路径
  uni.navigateTo({
    url: "/pages/preview/index?id=" + id,
  });
};

// 获取分类精选
function getCategorySelectList() {
  getCategorySelectListApi({
    select: true,
  }).then((res) => {
    categorySelectList.value = res.data;
    console.log("分类精选", res);
  });
}
getCategorySelectList();
</script>

<style lang="scss" scoped>
.home {
  // width: 750rpx;

  .banner {
    width: 750rpx;
    padding: 30rpx 0;
    swiper {
      width: 750rpx;
      height: 340rpx;
      &-item {
        width: 100%;
        height: 100%;
        padding: 0 30rpx;
        .link {
          width: 100%;
          height: 100%;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
      }
    }
  }

  .notice {
    width: 690rpx;
    height: 80rpx;
    margin: 0 auto;
    border-radius: 80rpx;
    background: #f9f9f9;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      width: 140rpx;
      .text {
        margin-left: 4rpx;
        color: $brand-theme-color;
        font-weight: 600;
        font-size: 28rpx;
      }
    }
    .middle {
      flex: 1;
      height: 100%;

      swiper {
        height: 100%;
        &-item {
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 30rpx;
          color: #666;
        }
      }
    }
    .right {
      width: 70rpx;
    }
  }

  // 每日精选
  .daily-select {
    padding-top: 50rpx;

    .change {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      color: #888;
      :deep() {
        .uni-icons {
          color: #888 !important;
        }
      }
      .text {
        margin-left: 4rpx;
      }
    }
    .select-list {
      margin-top: 30rpx;
      padding: 0 30rpx;
      scroll-view {
        white-space: nowrap;

        .item {
          display: inline-block;
          width: 200rpx;
          height: 430rpx;
          border-radius: 10rpx;
          overflow: hidden;
          margin-right: 15rpx;

          &:last-child {
            margin-right: 0;
          }

          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  // 分类精选
  .category-select {
    padding-top: 50rpx;
    .more {
      font-size: 32rpx;
      color: #888;
    }
    .category-list {
      margin-top: 30rpx;
      padding: 0 30rpx;
      display: grid;
      gap: 15rpx;
      grid-template-columns: repeat(3, 1fr);
    }
  }

  // 专题精选
  .topic-select {
    padding: 50rpx 0;
    .more {
      font-size: 32rpx;
      color: #888;
    }
  }
}
</style>
