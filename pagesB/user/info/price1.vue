<template>
	<view>
		<view class="box">
			<view class="box-price">
				<view class="box-price-money">{{ balance / 100 }}</view>
				<view class="box-price-text">元</view>
			</view>
			<view class="box-automatic"><view @click="updateStatus">开通自动扣费</view></view>
		</view>
		<view class="moeny">
			<view class="money-item" v-for="(item, index) in list" :key="index" :id="item.falg ? 'style' : ''" @click="change(index)">{{ (item.amount / 100) | numFilter }}元</view>
			<view class="money-item" :id="inputStyle ? 'input-style' : ''" style="display: flex;flex-direction: column;justify-content: center;">
				<input type="number" placeholder="其他金额" placeholder-class="input-style" class="input" @focus="inputFocus" @blur="inputBlur" v-model:value="otherBalance" />
			</view>
		</view>

		<view class="pay">
			<view class="pay-title">请选择支付方式</view>
			<view class="pay-body">
				<view class="pay-wx">
					<view class="pay-wx-img"></view>
					<view class="pay-wx-body">
						<view class="pay-wx-body-title">微信支付</view>
						<view class="pay-wx-body-info">安全可靠,后顾无忧</view>
					</view>
				</view>
				<view class="pay-radio">
					<label class="radio"><radio :checked="checked" style="transform:scale(0.6);" @click="changeStatus" /></label>
				</view>
			</view>
		</view>

		<view class="btn-cz" @click="recharge">立即充值</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			token: '',
			balance: 0,
			list: [
				{
					amount: 30 * 100,
					falg: true
				},
				{
					amount: 50 * 100,
					falg: false
				},
				{
					amount: 100 * 100,
					falg: false
				},
				{
					amount: 200 * 100,
					falg: false
				},
				{
					amount: 500 * 100,
					falg: false
				}
			],
			inputStyle: false,
			otherBalance: '',
			checked: true
		};
	},
	onLoad() {
		this.token = uni.getStorageSync('userList').accessToken;
		this.status = uni.getStorageSync('autoPayStatus');
		this.getMyBlance();
	},
	methods: {
		updateStatus() {
			uni.navigateTo({
				url: '../automatic/automatic'
			});
		},
		changeStatus() {
			this.checked = this.checked ? false : true;
		},
		inputFocus(e) {
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].falg = false;
			}
			this.inputStyle = true;
		},
		inputBlur(e) {
			if (this.otherBalance != '') {
				this.inputStyle = true;
			} else {
				this.inputStyle = false;
			}
		},
		/* 选择金额 */
		change(index) {
			this.otherBalance = '';
			this.inputStyle = false;
			for (let i = 0; i < this.list.length; i++) {
				if (i == index) {
					this.list[i].falg = true;
				} else {
					this.list[i].falg = false;
				}
			}
		},
		/* 查询我的余额 */
		getMyBlance() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/user/getUserBalance',
				method: 'get',
				success: res => {
					if (res.data.code == 200) {
						this.balance = res.data.data;
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 消费记录 */
		pricelog() {
			uni.navigateTo({
				url: '/pages/pay/payArray'
			});
		},
		/*充值*/
		recharge() {
			if (!this.checked) {
				uni.showToast({
					title: '请选择支付方式',
					icon: 'none'
				});
				return false;
			}
			let recharge = 0;
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].falg) {
					recharge = this.list[i].amount;
				}
			}
			if (this.otherBalance != '') {
				// recharge = this.otherBalance * 100
				recharge = parseInt(this.otherBalance) * 100;
			}
			if (recharge == 0) {
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
				method: 'get',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					price: recharge
				},
				success: res => {
					console.log(res);
					if (res.data.code == 200) {
						this.$req.request({
							url: 'api/unionpay/wxminiPay',
							data: {
								orderNo: res.data.data.orderNo
							},
							success: res => {
								uni.hideLoading();
								console.log(res);
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
														this.getMyBlance();
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
	},
	filters: {
		numFilter(value) {
			// 截取当前数据到小数点后两位
			let realVal = parseFloat(value).toFixed(2);
			return realVal;
		}
	}
};
</script>

<style>
.box {
	height: 300rpx;
	width: 100%;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.box-price {
	padding-left: 20rpx;
	display: flex;
}
.box-price-money {
	font-size: 30px;
}
.box-price-text {
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	padding-bottom: 10rpx;
}
.box-automatic {
	border: 1px red solid;
	padding-right: 20rpx;
}

.box-automatic view {
	padding: 18rpx 13rpx;
	border: 1px solid #ffffff;
	border-radius: 50rpx;
	font-size: 27rpx;
	text-align: center;
	float: right;
}

.input {
	text-align: center;
}

.input-style {
	text-align: center;
}

#input-style {
	border-color: rgb(59, 145, 8);
}

.top-m {
	margin: 30px 0px 0px 42%;
	color: #ff6767;
}

.margin {
	height: 60rpx;
	width: 100%;
	margin: 10px 0px 0px 0px;
}

.bg {
	background-color: #efe592;
	border-radius: 5px;
}
.bg:hover {
	color: red;
}

.tar-yuan {
	height: 350rpx;
	width: 90%;
	margin: auto;
	background-color: #ffffff;
	border-radius: 30upx;
	position: relative;
	top: -30px;
}

.padding {
	height: 100px;
}

.title {
	font-size: 30upx;
	font-weight: 700;
	border-radius: 30upx;
	padding-left: 30upx;
	color: #000000;
	height: 70rpx;
	line-height: 70rpx;
}

.moeny {
	display: flex;
	height: 280rpx;
	flex-wrap: wrap;
	margin-top: 20rpx;
	justify-content: space-around;
}

.money-item {
	border: 1px solid #ebebeb;
	width: 30%;
	height: 130upx;
	text-align: center;
	line-height: 130upx;
	color: #000000;
	background-color: #ffffff;
	border-radius: 15upx;
	font-size: 35rpx;
}

#style {
	background-color: rgb(59, 145, 8);
	color: #ffffff;
}
.pay {
	margin-top: 20rpx;
	width: 100%;
	height: 160rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.pay-title {
	padding-left: 20rpx;
}
.pay-body {
	display: flex;
	justify-content: space-around;
	background-color: #ffffff;
	height: 100rpx;
}
.pay-wx {
	width: 50%;
	height: 100%;
	display: flex;
	align-items: center;
	padding-left: 17rpx;
}
.pay-wx-img {
	background: url('https://kshht.gzmsdw.cn/imge_zsyy/html/pay/wxzf_new.png') no-repeat;
	background-size: 80%;
	background-position: center;
	width: 80rpx;
	height: 100%;
}
.pay-radio {
	width: 50%;
	height: 100%;
	text-align: right;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-right: 20rpx;
}
.pay-wx-body-info {
	color: rgb(86, 86, 86);
}
.pay-wx-body-title {
	font-size: 33rpx;
}
.btn-cz {
	position: absolute;
	bottom: 0px;
	left: 0px;
	right: 0px;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	font-size: 35rpx;
}
</style>
