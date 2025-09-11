<template>
  <view class="category pageBg">
    <!-- 加载中 -->
    <view class="loadingLayout" v-if="!categoryList.length && !noMoreData">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <custom-nav-bar title="分类"></custom-nav-bar>
    <view class="category-list">
      <category-item
        v-for="item in categoryList"
        :key="item._id"
        :item="item"
        class="item"></category-item>
    </view>

    <!-- 没有更多数据了 -->
    <view class="loadingLayout" v-if="categoryList.length || noMoreData">
      <uni-load-more
        :status="noMoreData ? 'noMore' : 'loading'"></uni-load-more>
    </view>
  </view>
</template>

<script setup>
import { getCategoryListApi } from "@/api/category.js";

const categoryList = ref([]); // 分类列表
const queryParams = {
  pageNum: 1,
  pageSize: 15,
};
const noMoreData = ref(false); // 是否有更多数据了

async function getCategoryList() {
  const res = await getCategoryListApi(queryParams);
  console.log("分类列表：", res);

  if (res.data.length < queryParams.pageSize) {
    noMoreData.value = true;
  }
  categoryList.value = [...categoryList.value, ...res.data];
}

getCategoryList();

// 触底加载更多
onReachBottom(() => {
  console.log(noMoreData.value);
  if (noMoreData.value) return;
  console.log("触底了");
  queryParams.pageNum++;
  getCategoryList();
});

// #ifdef MP
onShareAppMessage((e) => {
  console.log("触发分享", e);
  return {
    title: "壁纸小程序",
    path: "/pages/category/index",
  };
});
// #endif
</script>

<style lang="scss" scoped>
.category {
  &-list {
    width: 100%;
    padding: 30rpx;

    // display: grid;
    // grid-template-columns: repeat(3, 1fr);
    // gap: 15rpx;

    display: flex;
    flex-wrap: wrap;
    gap: 15rpx;
    .item {
      width: 220rpx; // 220*3 = 660; 660 + 15 + 15 = 690
    }
  }

  .loadMore {
    padding: 30rpx;
    display: flex;
    justify-content: center;
    color: #333;
  }
}
</style>
