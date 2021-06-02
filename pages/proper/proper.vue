<template>
	<view style="height: 100%;width: 100%;">
		<view class="view1">
			<view class="">
				<!-- #ifdef MP-WEIXIN -->
				<van-notice-bar speed="40" scrollable left-icon="//kshht.gzmsdw.cn/imge_zsyy/html/通知.png" color="#878787" background="#00000000" :text="notifications[0].title" />
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<uni-notice-bar :showIcon="true" :speed="40" scrollable single="true" color="#878787" background-color="#00000000" :text="notifications[0].title"></uni-notice-bar>
				<!-- #endif -->
			</view>
			<view @click="goDistrictNotice">
				<view>查看更多</view>
				<view class="cuIcon-right"></view>
			</view>
		</view>
		<!-- 社区通知结束 -->
		<!-- 底部菜单 -->

		<view class="cu-list">
			<view
				class="cu-item"
				v-for="(item, index) in cuIconList"
				:style="'background: linear-gradient(to left,' + colors[index][0] + ',' + colors[index][1] + ')'"
				:key="index"
				@click="navToList($event, item.id)"
			>
				<view>{{ item.name }}</view>
				<view><image :src="item.url"></image></view>
			</view>
		</view>
		<van-dialog id="van-dialog" />
		<van-dialog show-cancel-button @close="dialogShow = false" use-slot title="请选择当前所在小区及单元" :show="dialogShow" @confirm="bind">
			<view class="cu-form-group">
				<view>小区</view>
				<view class="action text-right" @click="goComSel">
					{{ item.name == null ? '选择' : item.name }}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view>单元</view>
				<view class="action text-right" @click="goUnit">
					{{ item == null ? '请先选择小区' : unit == null ? '去选择' : unit.unitName }}
					<text class="cuIcon-right"></text>
				</view>
			</view>
		</van-dialog>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import Dialog from '@/wxcomponents/vant/dialog/dialog.js';
import vanNoticeBar from '@/wxcomponents/vant/notice-bar/index';
import vanDialog from '@/wxcomponents/vant/dialog/index';
// #endif
// #ifdef MP-ALIPAY
import Dialog from '@/components/vant/dialog/dialog.js';
import uniNoticeBar from '@/components/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.vue';
import vanDialog from '@/components/vant/dialog/index';
// #endif
export default {
	components: {
		vanDialog,
		// #ifdef MP-WEIXIN
		vanNoticeBar
		// #endif
		// #ifdef MP-ALIPAY
		uniNoticeBar
		// #endif
	},
	data() {
		return {
			dialogShow: false,
			colors: [
				['#FB9D2E', '#FFCA60'],
				['#96A0AC', '#BDC5CE'],
				['#3C9DF6', '#60C7FC'],
				['#53CD29', '#A0E564'],
				['#BA3F72', '#0B8175'],
				['#79E5E0', '#ABA8E0'],
				['#13242C', '#295463'],
				['#447EF5', '#F97794'],
				['#ED615D', '#FEB692'],
				['#6866F7', '#2AFADF']
			],
			timeIDNotice: null,
			cuIconList: [
				{
					id: 1,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/物业.png',
					name: '物业缴费'
				},
				{
					id: 2,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/业主.png',
					name: '业主信息录入'
				},
				{
					id: 3,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/开门.png',
					name: '远程开门'
				},
				{
					id: 4,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/人脸.png',
					name: '人脸信息录入'
				},
				{
					id: 7,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/优惠券.png',
					name: '领取优惠券'
				},
				{
					id: 10,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/在线报修.png',
					name: '在线报修'
				},
				{
					id: 11,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/建议和投诉.png',
					name: '建议和投诉'
				},
				{
					id: 9,
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/其他.png',
					name: '其他服务'
				}
			],
			info: [],
			notifications: [],
			unit: null,
			item: null
		};
	},
	onShow() {
		this.setTabBarIndex(1);
		if (uni.getStorageSync('currC') && uni.getStorageSync('currU') && !uni.getStorageSync('notifications')) {
			this.getNotificationsList(uni.getStorageSync('currC').communityId);
		}
	},
	methods: {
		goComSel() {
			this.unit = null;
			uni.navigateTo({
				url: '../proper/ownerInfoInput/communitySelection/communitySelection?type=1&showType=1'
			});
		},
		goUnit() {
			if (this.item == null) {
				return;
			}
			uni.navigateTo({
				url: '../proper/ownerInfoInput/unit/unit?cId=' + this.item.communityId
			});
		},
		bind() {
			if (this.item && this.unit) {
				uni.setStorageSync('currC', this.item);
				uni.setStorageSync('currU', this.unit);
			}
			this.dialogShow = false;
		},
		bindXiaoQu() {
			if (!uni.getStorageSync('currC') || !uni.getStorageSync('currU')) {
				this.dialogShow = true
				return false;
			} else {
				return true;
			}
		},
		async getNotificationsList(cId) {
			if (cId != 0) {
				const ret = await this.$req.synchro({
					url: 'api/banner/getDetail',
					method: 'get',
					data: {
						pageIndex: 1,
						pageSize: 1000,
						communityId: cId
					}
				});
				for (let s of ret.data.data) {
					this.notifications.push(s);
				}
			}
			uni.setStorageSync('notifications', this.notifications);
		},
		openWin(url, opts) {
			aui.openWin(url, opts);
		},
		closeWin() {
			aui.closeWin();
		},
		headerHeight(e) {
			const { windowWidth, windowHeight } = uni.getSystemInfoSync();
			// #ifdef APP-PLUS
			this.contentHeight = windowHeight - e + 'px';
			// #endif
		},
		actionsheetCallback(e) {
			var _this = this;
		},
		goDistrictNotice() {
			uni.navigateTo({
				url: 'districtNotice'
			});
		},
		tologin: function() {
			uni.navigateTo({
				url: '../register/wxlogin'
			});
		},
		navToList(e, id) {
			if (id == 1) {
				//物业缴费
				if (this.isLogin()) {
					if (this.bindXiaoQu()) {
						uni.navigateTo({
							url: './userInfo/Property'
						});
					}
				}
			} else if (id == 2) {
				//业主信息
				if (this.isLogin()) {
					this.$req.request({
						url: 'api/community/getUserReviewInfo',
						method: 'GET',
						success: res => {
							if (res.data.code == 200) {
								if (res.data.data.length > 0) {
									if (res.data.data[0].status == 1) {
										uni.showToast({
											title: '你已提交了信息,正在审核中,请耐心等候。',
											icon: 'none'
										});
									} else if (res.data.data[0].status == 0) {
										Dialog.confirm({
											title: '审核未通过',
											message: '原因：' + res.data.data[0].reason + '\n是否重新录入？'
										})
											.then(() => {
												uni.navigateTo({
													url: './ownerInfoInput/ownerInfoInput'
												});
											})
											.catch(() => {
												console.log('取消重新录入');
											});
									} else {
										Dialog.confirm({
											title: '提示',
											message: '已录入一个小区信息，是否再次录入新的小区？'
										})
											.then(() => {
												uni.navigateTo({
													url: './ownerInfoInput/ownerInfoInput'
												});
											})
											.catch(() => {
												console.log('不再新增小区');
											});
									}
								} else {
									uni.navigateTo({
										url: './ownerInfoInput/ownerInfoInput'
									});
								}
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						},
						complete: data => {}
					});
				}
			} else if (id == 3) {
				//远程开门
				if (this.isLogin()) {
					if (this.bindXiaoQu()) {
						uni.navigateTo({
							url: './userInfo/userInfo'
						});
					}
				}
			} else if (id == 4) {
				//人脸信息录入
				if (this.isLogin()) {
					if (this.bindXiaoQu()) {
						uni.navigateTo({
							url: './faceInfonInput/faceInfonInput'
						});
					}
				}
			} else if (id == 5) {
				//停车缴费
				uni.showToast({
					title: '敬请期待',
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: './userInfo/stoppay'
				// })
			} else if (id == 7) {
				if (this.isLogin()) {
					uni.navigateTo({
						//优惠券
						url: 'coupon'
					});
				}
			} else if (id == 8) {
				if (this.isLogin()) {
					uni.navigateTo({
						//停车场包月
						url: 'parkingPackage'
					});
				}
			} else if (id == 9) {
				uni.showActionSheet({
					itemList: ['暂无'],
					success: function(res) {
						if (!res.cancel) {
						}
					}
				});
			} else if (id == 11) {
				uni.navigateTo({
					url: './feedback?pageType=0'
				});
			} else if (id == 10) {
				uni.navigateTo({
					url: './feedback?pageType=1'
				});
			}
		}
	}
};
</script>

<style>
.uList {
	padding: 0rpx;
	display: block;
	margin-top: 15upx;
}

.tip-login {
	font-size: 32rpx;
	font-weight: 700;
	text-align: center;
	width: 100%;
	height: 100%;
	padding-top: 500rpx;
	color: #969696;
}

.uList .uniListItem {
	color: #1c1c1c;
	font-size: 30px;
	font-weight: 600;
}

.header {
	width: 100%;
	height: 230rpx;
	position: relative;
}

.header-bg {
	height: 100rpx;
	width: 100%;
	background-color: rgb(59, 145, 8);
}

.header-menu {
	display: flex;
	flex-wrap: wrap;
	width: 92%;
	height: 202rpx;
	margin: 0 auto;
	position: absolute;
	top: 0px;
	left: 37rpx;
	border-radius: 30rpx;
	overflow: hidden;
}

.header-item {
	width: 33%;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.border-right {
	border-right: 1px solid #c0c0c0;
}

.border-bottom {
	border-bottom: 1px solid #c0c0c0;
}

.header-item view:first-child {
	width: 30%;
	height: 100%;
	background-color: #ffffff;
}

.header-item view:last-child {
	width: 70%;
	height: 100%;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}

.cu-avatar_new {
	font-variant: small-caps;
	margin: 0;
	padding: 0;
	display: inline-flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	background-color: #ccc;
	color: #ffffff;
	white-space: nowrap;
	position: relative;
	width: 64upx;
	height: 64upx;
	background-size: 55%;
	background-position: center;
	vertical-align: middle;
	font-size: 1.5em;
	background-repeat: no-repeat;
}

.cu-avatar_new.sm {
	width: 35upx;
	height: 35upx;
	font-size: 1em;
}

.swiper-box {
	border-radius: 0rpx;
	padding: 0px;
	height: 240upx;
}

.swiper-box .img {
	height: 100%;
	width: 100%;
}

.cu-item {
	width: 47%;
	text-align: center;
	height: 18%;
	display: flex;
	flex-direction: row;
	border-radius: 15px;
	margin: 1.5%;
	color: #ffffff;
	justify-content: center;
	align-items: center;
	position: relative;
	/* #ifdef MP-ALIPAY */
	height: 230rpx;
	/* #endif */
}
.cu-item > view:nth-of-type(1) {
	flex: 2;
	font-weight: bold;
}
.cu-item view:nth-of-type(2) {
	flex: 1;
	margin-right: 20upx;
}
.cu-item image {
	width: 120upx;
	height: 120upx;
}

.cu-list {
	display: flex;
	flex-wrap: wrap;
	height: 100%;
	align-content: flex-start;
}

.view1 {
	width: 100%;
	height: 70rpx;
	margin-bottom: 10rpx;
	background-color: #ffffff;
	display: flex;
}
.view1 > view:nth-of-type(1) {
	display: inline-block;
	width: 75%;
}
.view1 > view:nth-of-type(2) {
	display: inline-block;
	text-align: right;
	width: 25%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-right: 20rpx;
	padding-left: 20rpx;
	color: rgb(135, 135, 135);
}

.view2 {
	height: 50rpx;
	width: 50rpx;
	background-image: url('https://kshht.gzmsdw.cn/imge_zsyy/html/通知.png');
	background-repeat: no-repeat;
	background-size: 80%;
	background-position: center;
	margin-left: 5upx;
}

.view0 {
	background-color: #ffffff;
	margin-bottom: 10rpx;
	padding-bottom: 10rpx;
}

.view4 {
	font-size: 30rpx;
	line-height: 35rpx;
}

.view4 > view {
	text-align: center;
	color: rgb(135, 135, 135);
}

.view5 {
	display: flex;
	justify-content: space-between;
	width: 100%;
	height: 70rpx;
}

.view5 > view {
	display: flex;
	justify-content: center;
	align-items: center;
	padding-right: 20rpx;
	padding-left: 20rpx;
	color: rgb(135, 135, 135);
}
.cu-list::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
</style>
