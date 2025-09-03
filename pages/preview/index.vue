<template>
  <view class="preview">
    <swiper circular>
      <swiper-item>
        <image
          src="@/common/images/preview1.jpg"
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
        <uni-icons type="back" color="#fff" size="20"></uni-icons>
      </view>

      <!-- 日期时间 -->
      <view class="count">1 / 2</view>
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
          <uni-icons type="star" size="28"></uni-icons>
          <view class="text">5分</view>
        </view>

        <view class="box">
          <uni-icons type="download" size="23"></uni-icons>
          <view class="text">下载</view>
        </view>
      </view>

      <!-- 信息弹窗 -->
      <uni-popup ref="infoPopRef" type="bottom">
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
                  <uni-rate
                    readonly
                    touchable
                    :value="curImageInfo?.score"
                    size="16" />
                  <text class="score">{{ curImageInfo?.score }}分</text>
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
            <view class="title">{{ isScore ? "评分过了~" : "壁纸评分" }}</view>
            <view class="close" @click="handleCloseScorePop">
              <uni-icons type="closeempty" size="18" color="#999"></uni-icons>
            </view>
          </view>

          <view class="content">
            <uni-rate
              v-model="userScore"
              allowHalf
              :disabled="isScore"
              disabled-color="#FFCA3E" />
            <text class="text">{{ userScore }}分</text>
          </view>

          <view class="footer">
            <button
              @click="handleSubmitUserScore"
              :disabled="!userScore || isScore"
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
import { getDailySelectDetailApi, setImageScoreApi } from "@/api/home.js";
import { useSystemInfo } from "@/utils/system.js";
const { statusBarHeight } = useSystemInfo();

const curImageInfo = ref(null); // 保存当前图片的信息
const maskState = ref(true); // 控制是否显示mask层
const infoPopRef = ref(null); // 图片信息弹窗组件

// 返回按钮
const handleGoBack = () => {
  uni.navigateBack({
    success: () => {},
    fail: (err) => {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
  });
};

// mask层显示与隐藏
const handleMaskState = () => {
  maskState.value = !maskState.value;
};

// 获取每日推荐的大图详情
async function getDailySelectDetail(picId) {
  const res = await getDailySelectDetailApi({
    id: picId,
  });
  console.log("图片信息", res.data);
  curImageInfo.value = res.data[0];
}

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
const isScore = ref(false); // 当前图片是否已经评分了
const scorePopRef = ref(null); // 图片评分弹窗组件
// 打开评分弹窗
const handleOpenScorePop = () => {
  scorePopRef.value.open();
};
// 关闭评分弹窗
const handleCloseScorePop = () => {
  scorePopRef.value.close();
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
      isScore.value = true;
      handleCloseScorePop();
    }
  } catch (error) {
    console.log("err", error);
    uni.hideLoading();
    handleCloseScorePop();
  }
};

onLoad((options) => {
  const id = options.id;
  console.log("id", id);
  if (id) getDailySelectDetail(id);
});
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
      box-shadow: 0 2rpx 0 rgba(0, 0, 0, 0.1);
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
