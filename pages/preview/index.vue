<template>
  <view class="preview">
    <!-- <swiper circular @change="handleIndexChange" :current="curIndex">
      <swiper-item v-for="item in previewList" :key="item._id">
        <image
          :src="item.picUrl"
          mode="aspectFill"
          @click="handleMaskState"></image>
      </swiper-item>
    </swiper> -->

    <swiper circular @change="handleIndexChange" :current="curIndex">
      <swiper-item v-for="(item, index) in previewList" :key="item._id">
        <image
          v-if="loadedIndexSet.has(index)"
          :src="item.picUrl"
          mode="aspectFill"
          @click="handleMaskState"></image>
      </swiper-item>
    </swiper>

    <!-- 不能让这个mask占满全屏，不然就不能滑动图片了，这里就只能做为一个容器用
			mask现在没有宽高，内部元素全部脱离文档流了，也没有设置宽高
		 -->
    <view class="mask" v-show="maskState">
      <!-- 返回按钮 -->
      <view
        class="goBack"
        @click="handleGoBack"
        :style="{ top: statusBarHeight + 'px' }">
        <uni-icons
          v-if="isUserShare"
          type="home"
          color="#fff"
          size="20"></uni-icons>
        <uni-icons v-else type="back" color="#fff" size="20"></uni-icons>
      </view>

      <!-- 日期时间 -->
      <view class="count">{{ curIndex + 1 }} / {{ previewList.length }}</view>
      <view class="time">
        <uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
      </view>
      <view class="date">
        <uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
      </view>

      <!-- 底部 -->
      <view class="footer">
        <view class="box" @click="handleOpenInfoPop">
          <uni-icons type="info" size="28"></uni-icons>
          <view class="text">信息</view>
        </view>

        <view class="box" @click="handleOpenScorePop">
          <uni-icons
            v-if="curImageInfo?.userScore"
            type="star-filled"
            size="28"
            color="#efce4a"></uni-icons>
          <uni-icons v-else type="star" size="28"></uni-icons>
          <view class="text">
            {{ curImageInfo?.userScore || curImageInfo?.score }}分
          </view>
        </view>

        <view class="box" @click="handleSaveImage">
          <uni-icons type="download" size="23"></uni-icons>
          <view class="text">下载</view>
        </view>
      </view>

      <!-- 信息弹窗 -->
      <uni-popup ref="infoPopRef" type="bottom" :safe-area="false">
        <view class="infoPopup">
          <view class="popHeader">
            <!-- 布局占位 用 -->
            <view></view>
            <view class="title">壁纸信息</view>
            <view class="close" @click="handleCloseInfoPop">
              <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
            </view>
          </view>
          <scroll-view scroll-y>
            <view class="content">
              <view class="row">
                <view class="label">壁纸ID：</view>
                <text selectable class="value">{{ curImageInfo?._id }}</text>
              </view>

              <view class="row">
                <view class="label">分类：</view>
                <text class="value class">明星美女</text>
              </view>

              <view class="row">
                <view class="label">发布者：</view>
                <text class="value">{{ curImageInfo?.nickname }}</text>
              </view>

              <view class="row">
                <text class="label">评分：</text>
                <view class="value roteBox">
                  <template v-if="curImageInfo?.userScore">
                    <uni-rate
                      readonly
                      touchable
                      :value="curImageInfo?.userScore"
                      size="16" />
                    <text class="score">{{ curImageInfo?.userScore }}分</text>
                  </template>
                  <template v-else>
                    <uni-rate
                      readonly
                      touchable
                      :value="curImageInfo?.score"
                      size="16" />
                    <text class="score">{{ curImageInfo?.score }}分</text>
                  </template>
                </view>
              </view>

              <view class="row">
                <text class="label">摘要：</text>
                <view class="value">
                  {{ curImageInfo?.description }}
                </view>
              </view>

              <view class="row">
                <text class="label">标签：</text>
                <view class="value tabs">
                  <view
                    class="tab"
                    v-for="tab in curImageInfo?.tabs"
                    :key="tab">
                    {{ tab }}
                  </view>
                </view>
              </view>

              <view class="copyright">
                声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱513894357@qq.com，管理将删除侵权壁纸，维护您的权益。
              </view>

              <!-- 底部安全区域 -->
              <view class="safe-area-inset-bottom"></view>
            </view>
          </scroll-view>
        </view>
      </uni-popup>

      <!-- 评分弹窗 -->
      <uni-popup ref="scorePopRef" type="center" :is-mask-click="false">
        <view class="scorePopup">
          <view class="popHeader">
            <view></view>
            <view class="title">
              {{ curImageInfo?.userScore ? "已经评过分了~" : "壁纸评分" }}
            </view>
            <view class="close" @click="handleCloseScorePop">
              <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
            </view>
          </view>

          <view class="content">
            <uni-rate
              v-if="curImageInfo?.userScore"
              readonly
              touchable
              :value="curImageInfo?.userScore"
              size="16" />
            <uni-rate
              v-else
              v-model="userScore"
              allowHalf
              disabled-color="#FFCA3E" />
            <text class="text">
              {{ curImageInfo?.userScore || userScore }}分
            </text>
          </view>

          <view class="footer">
            <button
              @click="handleSubmitUserScore"
              :disabled="curImageInfo?.userScore || !userScore"
              type="default"
              size="mini"
              plain>
              确认评分
            </button>
          </view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import {
  getImageDetailApi,
  setImageScoreApi,
  downloadPicApi,
} from "@/api/home.js";
import { useSystemInfo } from "@/utils/system.js";

const { statusBarHeight } = useSystemInfo();

const previewList = ref([]); // 所有预览图片列表
const curImageInfo = ref(null); // 保存当前图片的信息
const curIndex = ref(-1); // 当前图片在数组中的索引值
const maskState = ref(true); // 控制是否显示mask层
const infoPopRef = ref(null); // 图片信息弹窗组件

const loadedIndexSet = new Set(); // 保存已经访问过的图片索引
let picId; // 图片id
const isUserShare = ref(false); // 用户是否通过其它用户分享进入该页面
// const scoreHash = {}; // 记录每一张图的评分值

function loadDataFromStorage() {
  // 从缓存中取出列表数据
  const data = uni.getStorageSync("previewList") || [];
  previewList.value = data.map((item) => {
    return {
      ...item,
      picUrl: item.smallPicurl.replace("_small.webp", ".jpg"),
    };
  });
}

// 获取单个图片详情
async function getImageDetail(picId) {
  const res = await getImageDetailApi({
    id: picId,
  });
  console.log("图片信息", res.data);
  // curImageInfo.value = res.data[0];
  previewList.value = res.data.map((item) => {
    return {
      ...item,
      picUrl: item.smallPicurl.replace("_small.webp", ".jpg"),
    };
  });
}

onLoad(async (options) => {
  picId = options.id;
  // 如果用户是通过其它用户分享进入的，直接请求数据
  if (options.type === "userShare") {
    console.log("用户通过他人分享进入");
    isUserShare.value = true;
    if (picId) await getImageDetail(picId);
  } else {
    loadDataFromStorage();
  }

  // 根据当前点击的图片id，确认在数组中的索引index
  curIndex.value = previewList.value.findIndex((item) => {
    return item._id === picId;
  });
  // 获取索引值以后,获取这张图片信息;轮播图跳转到当前索引位置
  if (curIndex.value !== -1) {
    curImageInfo.value = previewList.value[curIndex.value];
    preLoad();
  }
});

// "65615d42a7c432f4171a1c10"
// 返回按钮
const handleGoBack = () => {
  // 处理用户通过分享进入小程序以后，返回出错的情况 ，方法一
  // uni.navigateBack({
  //   success: () => {},
  //   // 这是针对用户通过分享进入小程序以后，返回出错的情况
  //   fail: (err) => {
  //     uni.reLaunch({
  //       url: "/pages/index/index",
  //     });
  //   },
  // });

  // 方法二：通过变量isUserShare.value值选择不同的逻辑
  if (isUserShare.value) {
    uni.reLaunch({
      url: "/pages/index/index",
    });
  } else {
    uni.navigateBack();
  }
};

// 当轮播图切换时
const handleIndexChange = (e) => {
  // 最新的索引值
  curIndex.value = e.detail.current;
  // 当前图片信息
  curImageInfo.value = previewList.value[curIndex.value];
  preLoad();
};

// mask层显示与隐藏
const handleMaskState = () => {
  maskState.value = !maskState.value;
};

// 打开信息弹窗
const handleOpenInfoPop = () => {
  infoPopRef.value.open();
};
// 关闭信息弹窗
const handleCloseInfoPop = () => {
  infoPopRef.value.close();
};

// 评分相关
const userScore = ref(0); // 用户对当前图片的评分；
const scorePopRef = ref(null); // 图片评分弹窗组件
// 打开评分弹窗
const handleOpenScorePop = () => {
  scorePopRef.value.open();
};
// 关闭评分弹窗
const handleCloseScorePop = () => {
  scorePopRef.value.close();
  userScore.value = 0;
};
// 提交用户评分
const handleSubmitUserScore = async () => {
  try {
    uni.showLoading({
      title: "加载中...",
    });
    const res = await setImageScoreApi({
      classid: curImageInfo.value.classid,
      wallId: curImageInfo.value._id,
      userScore: userScore.value,
    });
    uni.hideLoading();
    if (res.errCode === 0) {
      uni.showToast({
        title: "评分成功",
        icon: "none",
      });

      console.log("评分成功", res);

      // 评分成功以后，保存当前图片的评分，之后就不能在评分了
      // 评分成功以后，他的接口只返回了一个图片id,但是实际上在下一次请求图片列表时，有一个userScore值，表示用户评分
      // 如果没有这个字段，就表示用户没有评分。
      // 更新对应图片的数据
      previewList.value[curIndex.value].userScore = userScore.value;
      // 重新获取一次当前图片
      curImageInfo.value = previewList.value[curIndex.value];

      // 重新缓存
      uni.setStorageSync("previewList", previewList.value);
      // 关闭评分弹窗
      handleCloseScorePop();
    }
  } catch (error) {
    console.log("err", error);
    uni.hideLoading();
    handleCloseScorePop();
  }
};

// 预加载
function preLoad() {
  // 加入当前图片索引
  if (!loadedIndexSet.has(curIndex.value)) {
    loadedIndexSet.add(curIndex.value);
  }
  // 加入前一张和后一张图片索引
  let prev =
    (curIndex.value - 1 + previewList.value.length) % previewList.value.length;
  let next = (curIndex.value + 1) % previewList.value.length;
  if (!loadedIndexSet.has(prev)) loadedIndexSet.add(prev);
  if (!loadedIndexSet.has(next)) loadedIndexSet.add(next);
}

// 点击下载图片，保存到手机相册
const handleSaveImage = async () => {
  // #ifdef H5
  uni.showModal({
    title: "下载提示",
    content: "请长按保存壁纸",
    showCancel: false,
  });
  // #endif

  // #ifndef H5
  uni.showLoading({
    title: "下载中...",
    mask: true,
  });
  const localPath = await getImageLocalPath();
  uni.saveImageToPhotosAlbum({
    filePath: localPath,
    // 成功保存
    success: (res) => {
      console.log("保存成功", res);
      uni.showToast({
        title: "保存成功，请到相册查看",
        icon: "none",
      });
    },
    // 取消保存以及 拒绝授权 都会进入这个回调
    fail: (err) => {
      if (err.errMsg == "saveImageToPhotosAlbum:fail cancel") {
        uni.showToast({
          title: "保存失败，请重新点击下载",
          icon: "none",
        });
      }
      // 拒绝授权,需要提示用户，需要通过授权
      else {
        // 对话框的确定或者取消，都是进入success的回调
        uni.showModal({
          title: "授权提示",
          content: "需要授权保存到相册",
          success: (res) => {
            if (res.confirm) {
              // 确认授权，打开设置进行授权
              uni.openSetting({
                success(res) {
                  const anthRes = res.authSetting["scope.writePhotosAlbum"];
                  if (anthRes) {
                    uni.showToast({
                      title: "获取授权成功",
                      icon: "none",
                    });
                  } else {
                    uni.showToast({
                      title: "获取权限失败",
                      icon: "none",
                    });
                  }
                },
              });
            } else {
              uni.showToast({
                title: "拒绝授权",
                icon: "none",
              });
            }
          },
        });
      }
    },
    complete: () => {
      uni.hideLoading();
    },
  });
  // #endif
};

// getImageInfo全平台支持,获取图片信息
function getImageLocalPath() {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: curImageInfo.value.picUrl,
      success: (res) => {
        // 图片的本地路径
        const path = res.path;
        console.log("图片的本地路径", path);
        resolve(path);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

// #ifdef MP
// 这个页面中图片数据来自之前页面的缓存,如果是用户分享给新用户,那么新用户没有缓存,看不到图片
// type=userShare是在用户分享时传递一个参数，当页面加载时，检查这个参数，如果是通过分享进入的，就请求一次数据
onShareAppMessage((e) => {
  console.log("触发分享", e);
  return {
    title: `壁纸小程序`,
    path: `/pages/preview/index?id=${picId}&type=userShare`,
  };
});
// #endif
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100vh;
  position: relative;

  swiper {
    width: 100%;
    height: 100%;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .mask {
    background-color: lightblue;
    & > view {
      position: absolute;
      left: 0;
      right: 0;
      color: #fff;
      // 这两个属性配合，可以让元素保持块级状态，同时居中
      width: fit-content;
      margin: auto;
    }

    .goBack {
      width: 38px;
      height: 38px;
      background: rgba(0, 0, 0, 0.5);
      top: 0;
      left: 30rpx;
      margin-left: 0;
      border-radius: 100px;
      backdrop-filter: blur(10rpx);
      border: 1rpx solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .count {
      top: 10vh;
      background: rgba(0, 0, 0, 0.3);
      font-size: 28rpx;
      border-radius: 40rpx;
      padding: 8rpx 28rpx;
      backdrop-filter: blur(10rpx);
    }

    .time {
      font-size: 140rpx;
      top: calc(10vh + 80rpx);
      font-weight: 100;
      line-height: 1em;
      text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
    }

    .date {
      font-size: 34rpx;
      top: calc(10vh + 230rpx);
      text-shadow: 0 2rpx rgba(0, 0, 0, 0.3);
    }

    .footer {
      background: rgba(255, 255, 255, 0.8);
      bottom: 10vh;
      width: 65vw;
      height: 120rpx;
      border-radius: 120rpx;
      color: #000;
      display: flex;
      justify-content: space-around;
      align-items: center;
      // box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(20rpx);

      .box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rpx 12rpx;

        .text {
          font-size: 26rpx;
          color: $text-font-color-2;
        }
      }
    }
  }

  .popHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      color: $text-font-color-2;
      font-size: 26rpx;
    }

    .close {
      padding: 6rpx;
    }
  }

  .infoPopup {
    background: #fff;
    padding: 30rpx;
    border-radius: 30rpx 30rpx 0 0;
    overflow: hidden;

    scroll-view {
      max-height: 60vh;

      .content {
        .row {
          display: flex;
          padding: 16rpx 0;
          font-size: 32rpx;
          line-height: 1.7em;

          .label {
            color: $text-font-color-3;
            width: 140rpx;
            text-align: right;
            font-size: 30rpx;
          }

          .value {
            flex: 1;
            width: 0;
            color: #333;
          }

          .roteBox {
            display: flex;
            align-items: center;

            .score {
              font-size: 26rpx;
              color: $text-font-color-2;
              padding-left: 10rpx;
            }
          }

          .tabs {
            display: flex;
            flex-wrap: wrap;

            .tab {
              border: 1px solid $brand-theme-color;
              color: $brand-theme-color;
              font-size: 22rpx;
              padding: 10rpx 30rpx;
              border-radius: 40rpx;
              line-height: 1em;
              margin: 0 10rpx 10rpx 0;
            }
          }

          .class {
            color: $brand-theme-color;
          }
        }

        .copyright {
          font-size: 28rpx;
          padding: 20rpx;
          background: #f6f6f6;
          color: #666;
          border-radius: 10rpx;
          margin: 20rpx 0;
          line-height: 1.6em;
        }
      }
    }
  }

  .scorePopup {
    background: #fff;
    padding: 30rpx;
    width: 70vw;
    border-radius: 30rpx;

    .content {
      padding: 30rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .text {
        color: #ffca3e;
        padding-left: 10rpx;
        width: 80rpx;
        line-height: 1em;
        text-align: right;
        font-size: 28rpx;
      }
    }

    .footer {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
