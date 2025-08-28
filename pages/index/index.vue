<template>
  <view class="home">
    <!-- 轮播图 -->
    <view class="banner">
      <swiper
        indicator-dots
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#fff"
        autoplay
        circular>
        <swiper-item v-for="item in bannerList" :key="item._id">
          <!-- 跳转到其它小程序 -->
          <navigator
            v-if="item.target === 'miniProgram'"
            target="miniProgram"
            :app-id="item.appid">
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>

          <!-- 页面跳转 -->
          <navigator v-else :url="`/pages/classlist/classlist?${item.url}`">
            <image :src="item.picurl" mode="aspectFill"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup>
import { getHomeBannerApi } from "@/api/home.js";
const bannerList = ref([]);

function getHomeBanner() {
  getHomeBannerApi().then((res) => {
    bannerList.value = res.data;
    console.log("data", bannerList.value);
  });
}
getHomeBanner();
</script>

<style lang="scss" scoped></style>
