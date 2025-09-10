<template>
  <z-paging
    ref="paging"
    v-model="categoryList"
    @query="queryList"
    :default-page-size="15">
    <!-- 下拉刷新的加载动画与文本 -->
    <template #refresher="{ refresherStatus }">
      <custom-refresher :status="refresherStatus" />
    </template>

    <custom-nav-bar title="分类"></custom-nav-bar>
    <view class="category pageBg">
      <view class="category-list">
        <category-item
          v-for="item in categoryList"
          :key="item._id"
          :item="item"
          class="item"></category-item>
      </view>
    </view>

    <template #loadingMoreNoMore>
      <!-- 此处的custom-nomore为demo中自定义的组件，非z-paging的内置组件，请在实际项目中自行创建。
			这里插入什么view，没有更多数据就显示什么view -->
      <custom-nomore />
    </template>
  </z-paging>
</template>

<script setup>
import { getCategoryListApi } from "@/api/category.js";

const paging = ref(null);
const categoryList = ref([]); // 分类列表
const queryList = (pageNo, pageSize) => {
  console.log("pageNo, pageSize", pageNo, pageSize);
  getCategoryListApi({
    pageNum: pageNo,
    pageSize: pageSize,
  })
    .then((res) => {
      paging.value.complete(res.data);
    })
    .catch(() => {
      paging.value.complete(false);
    });
};

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
