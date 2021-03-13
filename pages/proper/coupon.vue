<!-- 优惠券列表页面 并领取 : -->
<template>
	<!-- <view class="coupon-content" :style="{backgroundImage: 'url(../../../static/image/bg-coupon.jpg)'}"> -->
	<view class="coupon-content">
		<view v-if="!isCoupon" class="coupon-is-not"><van-empty description="暂时没有可领取的优惠券" /></view>
		<scroll-view :scroll-top="scrollTop" scroll-y class="scroll-Y" @scroll="scroll" v-if="isCoupon" @scrolltolower="scrolltolower">
			<view v-for="(item, index1) in taskList" :key="index1" class="text scroll-view-item">
				<view class="view1">
					<view class="view1-symbol"><text>￥</text></view>
					<view class="view1-price">
						{{ item.discount }}
						<!-- <text>
							{{items.discount}}
						</text> -->
					</view>
				</view>
				<view class="conponInfo">
					<view class="conponTitle">{{ item.title }}</view>
					<view class="full">满{{ item.min }}元使用</view>
					<view class="timeSpent">有效期至 {{ $req.formatDate(item.gmtEnd) }}</view>
				</view>
				<view class="immediateReceipt">
					<button
						type="default"
						size="mini"
						:disabled="item.nowCount >= item.limit || item.surplus == 0"
						plain="true"
						:style="
							item.surplus == 0 || item.nowCount >= item.limit
								? 'color: #FFFFFF;background-color:#CCCCCC;border: none;'
								: 'color: #fe4a4d;background-color: #F0F0F0;border: none;'
						"
						@click="obtainCoupon(item.id)"
					>
						{{ item.surplus == 0 ? '已领完' : item.nowCount >= item.limit ? '已领取' : '点击领取' }}
					</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
export default {
	components: {
		vanEmpty
	},
	data() {
		return {
			imageURL: '',
			taskList: [],
			scrolls: false,
			scrollTop: 0,
			old: {
				scrollTop: 0
			},
			token: '',
			isCoupon: true,
			bgColor: [
				{
					background: 'linear-gradient(to bottom,#ff00ca, #ff1218)'
				},
				{
					background: 'linear-gradient(to right,#fe3267, #f9c04f)'
				},
				{
					background: 'linear-gradient(to right,#396bfe, #e80cea)'
				}
			]
		};
	},
	onLoad() {
		this.token = uni.getStorageSync('userList').accessToken;
		this.getCouponList();
	},
	methods: {
		scrolltolower: function(e) {
			uni.showToast({
				title: '暂无更多',
				icon: 'none'
			});
		},
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop;
		},
		goTop: function(e) {
			// 解决view层不同步的问题
			this.scrollTop = this.old.scrollTop;
			this.$nextTick(function() {
				this.scrollTop = 0;
			});
		},
		/* 获取用户可领优惠券 */
		getCouponList: function() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.$req.request({
				url: 'api/coupon/getObtainableCoupon',
				method: 'get',
				header: {
					ACCESSTOKEN: this.token,
					'Content-type': 'application/json; charset=UTF-8'
				},
				success: res => {
					if (res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.isCoupon = true;
							this.taskList = res.data.data;
							let taskList_new = [];
							let taskList_new2 = [];
							for (let i = 0; i < this.taskList.length; i++) {
								if (this.taskList[i].nowCount < this.taskList[i].limit && this.taskList[i].surplus > 0) {
									taskList_new.push(this.taskList[i]);
								} else {
									taskList_new2.push(this.taskList[i]);
								}
							}
							this.taskList = taskList_new;
							for (let i = 0; i < taskList_new2.length; i++) {
								this.taskList.push(taskList_new2[i]);
							}
							let random = 0;
							let newArr = this.taskList.map(v => {
								if (random == 3) {
									random = 0;
								}
								return { ...v, random: random++ };
							});
							this.taskList = newArr;
						} else {
							this.isCoupon = false;
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							success: function() {
								setTimeout(function() {
									uni.navigateBack();
								}, 1500);
							}
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 领取优惠券 */
		obtainCoupon: function(cId) {
			this.$req.request({
				url: 'api/coupon/obtainCoupon',
				method: 'get',
				data: {
					couponId: cId
				},
				success: res => {
					if (res.data.code == 400) {
						/* 已经领取过 */
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					} else if (res.data.code == 200) {
						/* 领取成功 */
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						/* 刷新页面 */
						setTimeout(() => {
							let page = getCurrentPages().pop();
							if (!page) return;
							page.onLoad();
						}, 1500);
					} else {
						/* 其他错误 */
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
					// setTimeout(function() {
					// 	uni.redirectTo({
					// 		url: '../coupon/coupon'
					// 	});
					// }, 1500)
				},
				complete: data => {}
			});
		}
	},
	onShow() {
		/* 优惠券列表大于3设置滚动 */
		if (this.taskList.length >= 5) {
			this.scrolls = true;
		} else {
			this.scrolls = false;
		}
	}
};
</script>

<style>
/* #page{
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
	} */
.coupon-content {
	z-index: 1000;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	width: 100%;
	/* background-size: cover;
		background-position: center center; */
	/* background-image: url(../../static/image/bg-coupon.jpg); */
}
.coupon-is-not {
	font-size: 40rpx;
	text-align: center;
	color: rgb(149, 149, 149);
	padding-top: 20rpx;
}
.uList {
	padding: 0rpx;
	display: block;
	margin-top: 15upx;
}

.uList .uniListItem {
	color: #1c1c1c;
	font-size: 30px;
	font-weight: 600;
}

.content {
	height: 100%;
	width: 100%;
	background-size: contain;
	position: absolute;
	padding-top: 10rpx;
	padding-bottom: 10rpx;
}

.scroll-Y {
	height: 100%;
	padding-top: 20rpx;
}

.text {
	background-color: #f1505c;
	height: 167rpx;
	color: #777;
	border-radius: 15px;
	margin-bottom: 40rpx;
	margin-left: 5px;
	margin-right: 5px;
	overflow: hidden;
	display: flex;
}
.view1 {
	height: 100%;
	width: 25%;
	color: #f8da8c;
	display: flex;
	justify-content: center;
	align-items: center;
}

.view1-symbol {
	height: 80%;
	width: 30%;
	position: relative;
	text-align: right;
}
.view1-symbol text {
	position: absolute;
	bottom: 18px;
	left: 0px;
	right: 0px;
	font-size: 30rpx;
}
.view1-price {
	height: 80%;
	width: 60%;
	font-size: 70rpx;
	line-height: 133rpx;
	font-weight: 700;
	/* position: relative; */
}

/* .view1-price text{
			position:absolute ;
			bottom: 0px;
			left: 0px;
			right: 0px;
		} */

.conponInfo {
	margin-left: 20rpx;
	height: 100%;
	color: #ffffff;
	width: 40%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.conponTitle {
	font-size: 30rpx;
	font-weight: 700;
}

.full {
	font-size: 30rpx;
}

.timeSpent {
	font-size: 20rpx;
}

.immediateReceipt {
	height: 100%;
	width: 30%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.immediateReceipt button {
	height: 75rpx;
	width: 100%;
	border-radius: 20px;
	text-align: center;
	line-height: 75rpx;
	font-size: 30rpx;
	font-weight: 700;
	color: #fe4a4d;
}
</style>
