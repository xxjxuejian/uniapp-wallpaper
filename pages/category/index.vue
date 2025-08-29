<template>
  <view class="category pageBg">
    <view class="category-list">
      <category-item
        v-for="item in categoryList"
        :key="item._id"
        :item="item"
        class="item"></category-item>
    </view>
  </view>
</template>

<script setup>
import { getCategoryListApi } from "@/api/category.js";

const categoryList = ref([]);

async function getCategoryList() {
  const res = await getCategoryListApi({
    pageNum: 1,
    pageSize: 7,
  });
  console.log("category res", res);
  categoryList.value = res.data;
}

getCategoryList();
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
}
</style>
