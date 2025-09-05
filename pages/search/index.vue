<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-bar">
      <uni-search-bar
        v-model="queryParams.keyword"
        @confirm="handleSearch"
        focus
        cancelButton="always"></uni-search-bar>
    </view>

    <view class=""></view>
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
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { getSearchApi } from "@/api/home.js";
const queryParams = reactive({
  keyword: "",
  pageNum: 1,
  pageSize: 9,
});

const resultList = ref([]); // 搜索结果
const historySearch = ref([]); // 最近搜索
const hotSearch = ref(["美女", "帅哥", "宠物", "卡通", "AI", "自然风光"]); //热门搜索

// 加载历史搜索关键词
historySearch.value = uni.getStorageSync("historySearch") || [];

function handleSearch() {
  getSearchApi(queryParams).then((res) => {
    console.log("搜索结果", res);

    // 把关键词添加进搜索历史
    const index = historySearch.value.findIndex((item) => {
      return item.toLowerCase() === queryParams.keyword.toLowerCase();
    });
    if (index !== -1) {
      historySearch.value.splice(index, 1);
    }
    historySearch.value.unshift(queryParams.keyword);
    // 重新保存一次历史搜素
    uni.setStorageSync("historySearch", historySearch.value);
  });
}

// 删除历史搜索
const handleDelHistory = () => {
  uni.showModal({
    title: "是否清空历史搜索？",
    success: (res) => {
      if (res.confirm) {
        historySearch.value = [];
      }
    },
  });
};

// tag点击事件
const handleTagClick = (item) => {
  queryParams.keyword = item;
  handleSearch();
};

//关闭有页面
onUnload(() => {
  // uni.removeStorageSync("");
});
</script>

<style lang="scss" scoped>
.search-page {
  .search-bar {
    padding: 0 10rpx;
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
}
</style>
