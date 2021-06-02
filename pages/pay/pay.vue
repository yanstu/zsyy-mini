<template>
	<view class="app">
		<view class="price-box">
			<!-- <text>系统原因，当前仅支持二维码支付</text> -->
			<text>支付金额</text>
			<text class="price">{{ price }}</text>
			<text class="text-right">订单号：{{ orderNo }}</text>
		</view>

		<view class="pay-type-list">
			<view class="cu-bar bg-white solid-bottom margin-top" style="margin-left: -60upx;"><text class="text-orange" style="margin:0 auto;">支付方式</text></view>
			<!-- #ifdef MP-ALIPAY -->
			<view class="type-item b-b" @click="changePayType(1)">
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/支付宝支付.png" class="icon icon-alipay"></image>
				<view class="con" style="margin-left: 8px;"><text class="tit">支付宝</text></view>
				<label class="radio"><radio value="" color="#fa436a" :checked="payType == 1" /></label>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="type-item b-b" @click="changePayType(1)">
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/微信支付.png" class="icon icon-alipay"></image>
				<view class="con" style="margin-left: 8px;"><text class="tit">微信支付</text></view>
				<label class="radio"><radio value="" color="#fa436a" :checked="payType == 1" /></label>
			</view>
			<!-- #endif -->
			<view class="type-item b-b" @click="changePayType(2)">
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/我的余额.png" class="icon icon-alipay"></image>
				<view class="con" style="margin-left: 8px;"><text class="tit">余额支付</text></view>
				<label class="radio"><radio value="" color="#fa436a" :checked="payType == 2" /></label>
			</view>
		</view>
		<text :disabled="submiting" class="mix-btn" @click="fail">发起支付</text>
	</view>
</template>
<script>
export default {
	data() {
		return {
			payType: 1,
			price: '',
			orderNo: '',
			submiting: false,
			status: '',
			paystatus: '',
			token: '',
			type: null,
			jumpType: 0
		};
	},
	computed: {},
	onLoad(option) {
		if (option.type) {
			this.jumpType = option.type;
		}
		this.token = uni.getStorageSync('userList').accessToken;
		this.price = option.actualPrice;
		this.orderNo = option.orderNo;
	},
	methods: {
		//选择支付方式
		changePayType(type) {
			this.payType = type;
		},
		//确认支付
		fail(e) {
			if (this.payType === 1) {
				this.$req.request({
					url: 'api/tongLianPay/pay',
					method: 'GET',
					data: {
						orderNo: this.orderNo,
						payType: 2,
						remark: ''
					},
					header: {	
						ACCESSTOKEN: this.token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					success: res => {
						var payinfo = res.data.data.payinfo;
						if (payinfo) {
							payinfo = JSON.parse(res.data.data.payinfo);
							uni.getProvider({
								service: 'payment',
								success: data => {
									uni.requestPayment({
										provider: data.provider[0],
										timeStamp: payinfo.timeStamp,
										nonceStr: payinfo.nonceStr,
										package: payinfo.package,
										signType: payinfo.signType,
										paySign: payinfo.paySign,
										success: result => {
											console.log(result);
											if (this.jumpType != 0) {
												uni.navigateBack({
													delta: 1
												});
											} else {
												uni.redirectTo({
													url: './payArray'
												});
											}
										},
										fail: err => {
											if (err.errMsg.endsWith('fail cancel')) {
												uni.showToast({
													title: '取消支付',
													icon: 'none'
												});
											}
										}
									});
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
			}
			if (this.payType === 2) {
				uni.showModal({
					title: '提示',
					content: '确认使用余额支付吗',
					showCancel: true,
					cancelText: '否',
					confirmText: '是',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '正在支付',
								mask: true
							});
							/* 余额支付 */
							this.$req.request({
								url: 'api/order/balancePay',
								method: 'get',
								data: {
									orderNo: this.orderNo
								},
								success: res => {
									if (res.data.code == 200) {
										uni.showToast({
											title: '支付成功',
											icon: 'none',
											mask: true
										});
										setTimeout(() => {
											console.log(this.jumpType);
											if (this.jumpType != 0) {
												uni.navigateBack({
													delta: 1
												});
											} else {
												uni.redirectTo({
													url: './payArray'
												});
											}
										}, 1000);
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: 'none',
											mask: true
										});
									}
								},
								complete: data => {
									setTimeout(() => {
										uni.hideLoading();
									}, 1500);
								}
							});
						}
					}
				});
			}
		}
	}
};
</script>
<style lang="scss">
.app {
	width: 100%;
}

.price-box {
	// background-color: #eee3e0;
	height: 265upx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 28upx;
	color: #6f7176;

	text {
		margin: 10rpx 0;
	}

	.price {
		font-size: 50upx;
		color: #ef2d1c;
		margin-top: 12upx;

		&:before {
			content: '￥';
			font-size: 40upx;
		}
	}
}

.pay-type-list {
	margin-top: 20upx;
	background-color: #fff;
	padding-left: 60upx;

	.type-item {
		height: 120upx;
		padding: 20upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 60upx;
		font-size: 30upx;
		position: relative;
		image {
			width: 28px;
			height: 28px;
			margin-left: 6px;
		}
	}

	.icon {
		width: 80upx;
		font-size: 52upx;
	}

	.icon-erjiye-yucunkuan {
		color: #fe8e2e;
	}

	.icon-weixinzhifu {
		width: 100px;
		height: 75px;
		color: #36cb59;
	}

	.icon-alipay {
		width: 100upx;
		height: 75upx;
		color: #01aaef;
	}

	.icon-ye {
		width: 100upx;
		height: 75upx;
		// color: #01aaef;
	}

	.tit {
		font-size: 26upx;
		color: #585858;
		margin-bottom: 4upx;
	}

	.con {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 24upx;
		color: #faa851;
	}
}

.mix-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 630upx;
	height: 80upx;
	margin: 80upx auto 30upx;
	font-size: 30upx;
	color: #ffffff;
	background-color: #39b54a;
	border-radius: 10upx;
	// box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
