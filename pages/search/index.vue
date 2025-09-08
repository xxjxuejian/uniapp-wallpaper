<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-bar">
      <uni-search-bar
        v-model="queryParams.keyword"
        @confirm="handleQuery"
        @cancel="handleClear"
        @clear="handleClear"
        focus
        cancelButton="always"></uni-search-bar>
    </view>

    <!-- 只有搜索结果为空时,才显示最近搜索和热门搜索 -->
    <view v-if="!resultList.length && isShowSearch">
      <!-- 最近搜索 -->
      <view v-if="historySearch.length" class="latest search">
        <view class="title">
          <view class="text">最近搜索</view>
          <view class="icon" @click="handleDelHistory">
            <uni-icons type="trash" size="20"></uni-icons>
          </view>
        </view>
        <view class="tags">
          <view
            class="tag"
            v-for="(item, index) in historySearch"
            :key="index"
            @click="handleTagClick(item)">
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="hot search">
        <view class="title">
          <view class="text">热门搜索</view>
        </view>
        <view class="tags">
          <view
            class="tag"
            v-for="(item, index) in hotSearch"
            :key="index"
            @click="handleTagClick(item)">
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <!-- <l-empty v-if="!isShowSearch !resultList.length" description="空空如也" /> -->
    </view>

    <!-- 搜索结果 -->
    <view v-else class="search-res">
      <view class="search-list">
        <view
          class="item"
          v-for="item in resultList"
          :key="item._id"
          @click="handleGoPreview(item._id)">
          <image :src="item.smallPicurl" mode="aspectFill"></image>
        </view>
      </view>

      <!-- 没有更多数据了 -->
      <view v-if="resultList.length || noData" class="loadingLayout">
        <uni-load-more :status="noData ? 'noMore' : 'loading'"></uni-load-more>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area-inset-bottom"></view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { getSearchApi } from "@/api/home.js";

const queryParams = reactive({
  keyword: "",
  pageNum: 1,
  pageSize: 12,
});

const historySearch = ref([]); // 最近搜索
const hotSearch = ref(["美女", "帅哥", "宠物", "卡通", "AI", "自然风光"]); //热门搜索
const resultList = ref([]); // 搜索结果
const noData = ref(false); // 是不是没有数据了
const isShowSearch = ref(true); // 是否显示search相关盒子

// 加载历史搜索关键词
historySearch.value = uni.getStorageSync("historySearch") || [];

// 搜索查询,回车搜索触发
async function handleQuery() {
  uni.showLoading({
    title: "加载中",
  });

  if (queryParams.keyword.trim() === "") {
    uni.showToast({
      title: "请输入查询关键词",
      icon: "none",
    });
    queryParams.keyword = "";
    return;
  }

  // 重新通过回车搜索触发查询，需要重置查询参数
  resetParams(queryParams.keyword);
  await searchData();
  uni.hideLoading();
  saveToHistory();
  // 输入的关键词查不到数据，就应该显示查询结果页，同时显示空状态
  // 空状态只有在输入的查询关键词 一条数据都查不到的时候，才显示
  if (!resultList.value.length) {
    isShowSearch.value = false;
  }
}

// 触底加载触发
async function searchData() {
  try {
    const res = await getSearchApi(queryParams);
    console.log("查询结果res", res);
    if (res.data.length < queryParams.pageSize) noData.value = true;
    resultList.value = [...resultList.value, ...res.data];
  } catch (err) {
  } finally {
  }
}

// 搜索关键词加入到历史搜索中,只保留最近的10个关键词
function saveToHistory() {
  const index = historySearch.value.findIndex((item) => {
    return item.toLowerCase() === queryParams.keyword.toLowerCase();
  });
  if (index !== -1) {
    historySearch.value.splice(index, 1);
  }
  historySearch.value.unshift(queryParams.keyword);
  historySearch.value = historySearch.value.slice(0, 10);
  // 重新保存一次历史搜素
  uni.setStorageSync("historySearch", historySearch.value);
}

// 重置各种参数
function resetParams(keyWord = "") {
  queryParams.keyword = keyWord;
  queryParams.pageNum = 1;
  queryParams.pageSize = 12;
  resultList.value = [];
  noData.value = false;
  isShowSearch.value = true;
}

const handleClear = () => {
  resetParams();
};

// 删除历史搜索
const handleDelHistory = () => {
  uni.showModal({
    title: "是否清空历史搜索？",
    success: (res) => {
      if (res.confirm) {
        historySearch.value = [];
        uni.removeStorageSync("historySearch");
      }
    },
  });
};

// tag点击事件,每次点击都是一次新的搜索,所有参数都要重置
const handleTagClick = (item) => {
  queryParams.keyword = item;
  handleQuery();
};

// 跳转到预览页面
const handleGoPreview = (id) => {
  // 跳转之前，把当前的图片列表保存，到预览页就不用请求数据了
  uni.setStorageSync("previewList", resultList.value);
  uni.navigateTo({
    url: "/pages/preview/index?id=" + id,
  });
};

//触底加载更多
onReachBottom(() => {
  if (noData.value) return;
  queryParams.pageNum++;
  searchData();
});

//关闭有页面
onUnload(() => {
  uni.removeStorageSync("previewList");
});
</script>

<style lang="scss" scoped>
.search-page {
  .search-bar {
    padding: 0 10rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
  }

  .latest {
    // background-color: lightcoral;
  }
  .hot {
    // background-color: lightblue;
  }

  .search {
    padding: 30rpx;

    .title {
      margin-bottom: 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .icon {
    }
    .tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .tag {
        background: #f4f4f4;
        font-size: 28rpx;
        color: #333;
        padding: 10rpx 28rpx;
        border-radius: 50rpx;
        margin-right: 20rpx;
        margin-top: 20rpx;
      }
    }
  }

  .search-res {
    .search-list {
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
}
</style>
