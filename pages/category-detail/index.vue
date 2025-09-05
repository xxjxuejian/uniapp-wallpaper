<template>
  <view class="category-detail">
    <!-- 是不是可以用全屏加载中遮罩？ -->
    <view class="loadingLayout" v-if="!detailList.length && !noData">
      <uni-load-more status="loading"></uni-load-more>
    </view>

    <view class="content">
      <view
        class="item"
        v-for="item in detailList"
        :key="item._id"
        @click="handleGoPreview(item._id)">
        <image :src="item.smallPicurl" mode="aspectFill"></image>
      </view>
    </view>

    <!-- 没有更多数据了 -->
    <view class="loadingLayout" v-if="detailList.length || noData">
      <uni-load-more :status="noData ? 'noMore' : 'loading'"></uni-load-more>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-inset-bottom"></view>
  </view>
</template>

<script setup>
import { getCateDetailListApi } from "@/api/category.js";
import { getUserHisListApi } from "@/api/user.js";

let pageTitleName = ""; //当前页面标题
const detailList = ref([]); // 详细图片列表
const noData = ref(false); // 是不是没有数据了
const queryParams = {
  pageNum: 1,
  pageSize: 12,
};

// 获取详细图片列表
async function getDetailList() {
  let res;
  // 如果id存在,调用这个函数
  if (queryParams.classid) res = await getCateDetailListApi(queryParams);
  if (queryParams.type) res = await getUserHisListApi(queryParams);
  const data = res.data;
  // 如果type存在,调用这个函数
  console.log("图片列表", data);

  // 判断是否还有数据
  if (queryParams.pageSize > data.length) {
    noData.value = true;
  }
  detailList.value = [...detailList.value, ...res.data];
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

// 触底加载更多
// 触底加载下一页，就是修改页码，获取新的一个页面数据，但是还要考虑之前的已经加载的数据，
// 所以需要一个
onReachBottom(() => {
  console.log(noData.value);
  if (noData.value) return;
  console.log("触底了");
  queryParams.pageNum++;
  getDetailList();
});

// 跳转到预览页面
const handleGoPreview = (id) => {
  // 跳转之前，把当前的图片列表保存，到预览页就不用请求数据了
  uni.setStorageSync("previewList", detailList.value);
  uni.navigateTo({
    url: "/pages/preview/index?id=" + id,
  });
};

// #ifdef MP
onShareAppMessage((e) => {
  console.log("触发分享", e);
  return {
    title: `壁纸小程序-${pageTitleName}`,
    path: `/pages/category-detail/index?id=${queryParams.classid}&name=${pageTitleName}`,
  };
});
// #endif
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
