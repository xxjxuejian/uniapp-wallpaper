<template>
  <view class="category-detail">
    <view class="content">
      <view
        :url="'/pages/preview/index?id=' + item._id"
        class="item"
        v-for="item in detailList"
        :key="item._id">
        <image :src="item.smallPicurl" mode="aspectFill"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
// import {
//   onLoad,
//   onUnload,
//   onReachBottom,
//   onShareAppMessage,
//   onShareTimeline,
// } from "@dcloudio/uni-app";

import { getCateDetailListApi } from "@/api/category.js";
import { getUserHisListApi } from "@/api/user.js";

let pageTitleName = ""; //当前页面标题
const detailList = ref([]); // 详细图片列表
const queryParams = {
  pageNum: 1,
  pageSize: 10,
};

// 获取详细图片列表
async function getDetailList() {
  let res = undefined;
  // 如果id存在,调用这个函数
  if (queryParams.classid) {
    res = await getCateDetailListApi(queryParams);
  } else {
    res = await getUserHisListApi(queryParams);
  }
  // 如果type存在,调用这个函数
  console.log("图片列表", res);
  detailList.value = res.data;
}

//option为object类型，会序列化上个页面传递的参数
onLoad((option) => {
  // id：用来作为classid查询参数；name:用来作为当前页面标题；
  // type：我的下载和我的评分点击时,也是跳转到这个页面的
  // 有id,没有type,; 有type,没有id;
  let { id = null, name = null, type = null } = option;
  if (id) queryParams.classid = id;
  if (type) queryParams.type = type;
  if (name) pageTitleName = name;

  console.log(type, id, name);
  // 修改导航标题
  uni.setNavigationBarTitle({
    title: pageTitleName,
  });
  // 获取详细图片列表
  getDetailList();
});
</script>

<style lang="scss" scoped>
.category-detail {
  .content {
    padding: 5rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rpx;
    .item {
      height: 440rpx;
      image {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
