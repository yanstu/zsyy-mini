<template>
	<view class="container_new">
		<!-- 受权弹框提醒 -->
		<view class="container">
			<view class="float" :hidden="viewShowed">
				<view class="floatContent">
					<text>允许授权获取手机号</text>
					<view class="floatText">
						<button @click="cancle" class="btn-cancle">取消</button>
						<button class="btn-cancle" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">确认</button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="order.length == 0"><van-empty description="啥也没有" /></view>

		<view v-else>
			<view v-if="statusID">
				<view v-for="(item, index) in order" :key="index" class="grad padding-xl radius shadow-warp bg-white margin-top">
					<view class="flex solid-bottom justify-between">
						<view class="padding-sm margin-xs radius">{{ item.parkName }}</view>
						<view class="padding-sm margin-xs radius">{{ item.ticketName }}</view>
					</view>
					<view class="flex flex-wrap">
						<view class="basis-xl margin-xs padding-sm radius">
							<text style="color: #007ACC;margin-right: 10rpx;" class="cuIcon-location"></text>
							地址：{{ item.address }}
						</view>
					</view>
					<view class="flex solid-bottom justify-between">
						<view class="padding-sm radius">
							<text style="color: #FFA924;margin-right: 10rpx;" class="cuIcon-moneybag"></text>
							价格：{{ item.price }}
						</view>
						<view class="padding-sm radius"><text class="cu-btn shadow" @click="submit(item)">开通</text></view>
					</view>
				</view>
			</view>
			<view v-if="!statusID" style="text-align: center; margin-top:30%;">
				<view><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/logo.png" style="width: 200px; height: 200px;margin-bottom: 60rpx;"></image></view>
				<text class="cuIcon-card text-black margin-top" @click="mcto">你已开通此停车场的包月服务</text>
			</view>
		</view>
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
			order: '',
			parkName: '',
			code: '',
			status: 0,
			token: '',
			mymht: '',
			statusID: true,
			viewShowed: true
		};
	},
	onShow() {},
	onLoad(option) {
		var res = this.checkLogin('../user/userService/serviceList', '2');
		if (!res) {
			return false;
		}
		this.parkName = uni.getStorageSync('plateNumber');
		this.token = res;
		this.code = option.parkcode;
		this.getOrderList();
	},
	methods: {
		mcto() {
			uni.navigateTo({
				url: '../myMonth/myMonth'
			});
		},
		submit(item) {
			let data = uni.getStorageSync('userList');
			if (!data.phone) {
				this.viewShowed = false;
				return false;
			}
			uni.navigateTo({
				// url:"../myMonth/mycmcc/mycmcc",
				url: `../myMonth/mycmcc?montID=${item.monthTicketConfigId}&statusID=${item.ticketName}`
			});
		},
		cancle() {
			this.viewShowed = true;
		},
		getPhoneNumber(e) {
			this.viewShowed = true;
			if (!e.detail.iv) {
				uni.showToast({
					title: '授权失败',
					icon: 'none'
				});
				return false;
			}
			uni.showLoading({
				title: ''
			});
			this.$req.request({
				url: 'api/user/miniInfoDecode',
				data: {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				},
				success: res => {
					if (res.data.code == 200) {
						this.$req.request({
							url: 'api/user/syncUserInfo',
							data: {
								phone: JSON.parse(res.data.data).phoneNumber
							},
							success: result => {
								if (result.data.code == 200) {
									let userList = uni.getStorageSync('userList');
									userList = { ...userList, phone: JSON.parse(res.data.data).phoneNumber };
									uni.setStorageSync('userList', userList);
									this.viewShowed = true;
								} else {
									uni.showToast({
										title: result.data.msg,
										icon: 'none'
									});
								}
							},
							complete: data => {
								uni.hideLoading();
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 查询服务 */
		getOrderList() {
			this.$req.request({
				url: 'api/ticket/findTicketList',
				method: 'get',
				data: {
					parkCode: this.code
				},
				success: res => {
					if (res.data.code == 200) {
						this.order = res.data.data;
						this.cmccList();
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		cmccList() {
			this.$req.request({
				url: 'api/ticket/findMyMonthTicketList',
				method: 'get',
				data: {
					parkCode: this.code
				},
				success: res => {
					this.mymht = res.data.data;
					for (let i = 0; i < this.mymht.length; i++) {
						if (this.mymht[i].carNo == this.parkName) {
							this.statusID = false;
							break;
						} else {
							this.statusID = true;
						}
					}
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
/* 手机号授权 */
.float {
	height: 100%;
	width: 100%;
	position: fixed;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 2;
	top: 0;
	left: 0;
}

.floatContent {
	/* padding: 20rpx 0;   */
	width: 80%;
	background: #fff;
	margin: 40% auto;
	border-radius: 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	position: relative;
	height: 255rpx;
}

.floatContent text {
	color: #000;
	font-size: 40rpx;
	display: block;
	margin: 0 auto;
	position: absolute;
	top: 50rpx;
	/* text-align: center;   */
	/* line-height: 60rpx;   */
	border-radius: 30rpx;
}

.floatText {
	width: 100%;
	height: 100rpx;
	display: flex;
	justify-content: flex-start;
	position: absolute;
	bottom: 0;
}

.btn-cancle {
	line-height: 100rpx;
	flex: 1;
	margin: 0;
	padding: 0;
	border-radius: none;
}

.container_new {
	background-color: #e7e7e7;
	height: 100%;
	padding-top: 30rpx;
}

.grad {
	width: 90%;
	/* border: 1px solid red; */
	margin: 0rpx auto 30rpx;
	padding: 25rpx;
	background-color: #f4f4f4;
}

.item-plate {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}

.item-license-plate {
	width: 30%;
	text-decoration: underline;
	color: #007aff;
}

.item {
	margin-bottom: 15rpx;
	color: #000000;
}

.title {
	font-size: 29rpx;
	color: #000000;
	font-weight: 700;
}

.status {
	font-size: 29rpx;
	color: #969696;
	font-weight: 700;
}

.item-text {
	margin-left: 8rpx;
}
</style>
