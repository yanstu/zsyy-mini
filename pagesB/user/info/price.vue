<template>
	<view class="price">
		<view class="sawtooth">
			<view class="icon"><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/充值icon.png"></image></view>
			<view class="sawtooth-top">
				<view>
					余额
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/问号.png"></image>
				</view>
				<view>
					<text>{{ balance / 100 }}元</text>
					<text v-show="balance / 100 < 100000">余额低，请尽快充值</text>
				</view>
			</view>
			<van-divider hairline />
			<view class="infos">
				<view class="info">
					<view>缴费户名</view>
					<view>{{ name }}</view>
				</view>
				<view class="info">
					<view>居住地址</view>
					<view>{{ address }}</view>
				</view>
			</view>
			<view @click="toAutomatic" class="automatic">
				<view>
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/自动续费.png"></image>
					自动续费，安全又省心
				</view>
				<view>
					去开通
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/箭头.png"></image>
				</view>
			</view>
			<view class="money">
				<text>输入金额</text>
				<van-field :value="inputValue" clearable input-class="input-class" label-class="label-class" label="￥" placeholder="请输入缴费金额" />
				<view class="moneybtn">
					<view @click="fastFill(50)">50元</view>
					<view @click="fastFill(100)">100元</view>
					<view @click="fastFill(150)">150元</view>
				</view>
			</view>
		</view>
		<view class="btn">
			<button @click="recharge" type="primary">立即缴费</button>
			<text @click="toRecord">缴费记录</text>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanField from '@/wxcomponents/vant/field/index';
import vanDivider from '@/wxcomponents/vant/divider/index';
import vanCell from '@/wxcomponents/vant/cell/index';
// #endif
// #ifdef MP-ALIPAY
import vanField from '@/components/vant/field/index';
import vanDivider from '@/components/vant/divider/index';
import vanCell from '@/components/vant/cell/index';
// #endif
export default {
	components: {
		vanField,
		vanDivider,
		vanCell
	},
	data() {
		return {
			token: '',
			balance: 0,
			inputValue: 0,
			name: '未知',
			address: '无'
		};
	},
	onLoad(option) {
		this.getMyBlance();
		this.token = uni.getStorageSync('userList').accessToken;
		this.status = uni.getStorageSync('autoPayStatus');
		this.name = uni.getStorageSync('currC').name;
		this.address = uni.getStorageSync('currU').unitName;
		uni.hideLoading();
	},
	methods: {
		/* 查询余额 */
		getMyBlance() {
			this.$req.request({
				url: 'api/user/getUserBalance',
				method: 'get',
				success: res => {
					if (res.data.code == 200) {
						this.balance = res.data.data;
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		},
		fastFill(val) {
			this.inputValue = val;
		},
		toRecord() {
			uni.navigateTo({
				url: '../../pay/payArray'
			});
		},
		toAutomatic() {
			uni.navigateTo({
				url: '../automatic/automatic'
			});
		},
		updateStatus() {
			uni.navigateTo({
				url: '../automatic/automatic'
			});
		},
		/*充值*/
		recharge() {
			if (this.inputValue == 0) {
				uni.showToast({
					title: '充值金额必须大于0',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '请稍后'
			});
			this.$req.request({
				url: 'api/order/submitCzOrder',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					price: this.inputValue,
					productId: 0
				},
				success: res => {
					if (res.data.code == 200) {
						this.$req.request({
							url: 'api/unionpay/wxminiPay',
							data: {
								orderNo: res.data.data.orderNo
							},
							success: res => {
								uni.hideLoading();
								if (res.data.errCode == 'SUCCESS') {
									uni.getProvider({
										service: 'payment',
										success: data => {
											if (data.provider.indexOf('wx')) {
												uni.requestPayment({
													provider: data.provider,
													timeStamp: res.data.payParams.timeStamp,
													nonceStr: res.data.payParams.nonceStr,
													package: res.data.payParams.package,
													signType: res.data.payParams.signType,
													paySign: res.data.payParams.paySign,
													success: result => {
														uni.navigateTo({
															url: '../../pay/payArray'
														});
													},
													fail: err => {
														console.log('支付失败');
														console.log(err);
														if (err.errMsg.endsWith('fail cancel')) {
															uni.showToast({
																title: '取消支付',
																icon: 'none'
															});
														}
													}
												});
											} else if (data.provider.indexOf('ali')) {
												/* 支付宝支付*/
											}
										}
									});
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									});
								}
							},
							complete: data => {}
						});
					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
.price {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f8f7f8;
	width: 100%;
	height: 100%;
}
.sawtooth {
	padding: 30rpx;
	position: relative;
	height: 70vh;
	width: 82vw;
	background-color: #ffffff;
	box-shadow: 0px 0px 5px rgba(211, 210, 211, 1);
	/* #ifdef MP-ALIPAY */
	width: 90%;
	/* #endif */
}
.sawtooth:after {
	display: block;
	content: '';
	height: 20px;
	background-size: 20px 40px;
	background-image: linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent), linear-gradient(-45deg, #ffffff 25%, transparent 25%, transparent),
		linear-gradient(45deg, transparent 75%, #ffffff 75%), linear-gradient(-45deg, transparent 75%, #ffffff 75%);
}
.sawtooth-top {
	width: 100%;
	height: 20%;
	display: flex;
}
.sawtooth-top > view {
	flex: 1;
	text-align: left;
	margin-top: 10%;
}
.sawtooth-top > view image {
	margin-left: 10rpx;
	height: 30rpx;
	width: 30rpx;
	vertical-align: middle;
}
.sawtooth-top > view:nth-of-type(1) {
	margin-left: 20rpx;
}

.sawtooth-top > view:nth-of-type(2) {
	flex: 1.5;
	display: flex;
	flex-direction: column;
}
.sawtooth-top > view:nth-of-type(2) text:nth-of-type(1) {
	font-size: 35rpx;
	font-weight: bold;
}

.sawtooth-top > view:nth-of-type(2) text:nth-of-type(2) {
	margin-top: 10rpx;
	color: #ffd84e;
}

.vanicon {
	margin-top: 20rpx;
}

.infos {
	height: 20%;
	display: flex;
	flex-direction: column;
}
.info {
	display: flex;
	margin: 15rpx 0rpx;
}
.info > view {
	flex: 1;
	text-align: left;
}
.info > view:nth-of-type(1) {
	margin-left: 20rpx;
}
.info > view:nth-of-type(2) {
	flex: 1.5;
	font-weight: 600;
}

.icon {
	position: absolute;
	left: 42%;
	top: -45rpx;
}
.icon image {
	width: 110rpx;
	height: 110rpx;
}
.btn {
	display: flex;
	flex-direction: column;
}
.btn button {
	width: 90vw;
	background-color: #00a950;
	border-radius: 5rpx;
	margin-top: 80rpx;
}
.btn text {
	margin-top: 30rpx;
	color: #0062cc;
	font-size: 24rpx;
}
.automatic {
	background-color: #effdf4;
	color: #31b575;
	display: flex;
	height: 75rpx;
	line-height: 75rpx;
	padding: 15rpx;
	/* #ifdef MP-ALIPAY */
	padding: 0rpx 10rpx;
	/* #endif */
}
.automatic > view:nth-of-type(1) {
	flex: 2;
	text-align: left;
}
.automatic > view:nth-of-type(1) image {
	height: 40rpx;
	width: 40rpx;
	vertical-align: middle;
	margin-right: 10rpx;
}

.automatic > view:nth-of-type(2) {
	flex: 1;
	text-align: right;
}
.automatic > view:nth-of-type(2) image {
	height: 35rpx;
	width: 35rpx;
	vertical-align: middle;
	margin-left: 5rpx;
}
.money {
	display: flex;
	flex-direction: column;
	text-align: left;
}
.money text {
	margin: 30rpx 0rpx;
	margin-left: 15rpx;
}
.label-class {
	font-weight: bolder;
	font-size: 45rpx;
	color: #000000;
}
.input-class {
	font-weight: bolder;
	font-size: 35rpx;
	color: #000000;
}

.moneybtn {
	margin-top: 40rpx;
	display: flex;
}
.moneybtn view {
	flex: 1;
	width: 31%;
	margin-right: 2%;
	background-color: #f4f4fa;
	color: #000000;
	line-height: 65rpx;
	height: 65rpx;
	text-align: center;
}
.moneybtn view:hover {
	background-color: #00a950;
	color: white;
}
.moneybtn view:last-child {
	margin: 0;
}
</style>
