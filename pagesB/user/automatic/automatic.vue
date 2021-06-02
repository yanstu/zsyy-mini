<!-- 自动扣费 -->
<template>
	<view>
		<view class="father">
			<view class="title">停车场免密支付</view>
			<view class="info">
				<view class="public">
					用户账号:
					<text style="color:#0000FF;">{{ userInfo }}</text>
				</view>
				<view class="public">
					套餐内容:
					<text>{{ packageContent }}</text>
				</view>
			</view>
			<view class="modalities">
				<view class="public">
					扣费方式:
					<text style="color: #E6852C;" class="cuIcon-moneybagfill"></text>
					<text>余额</text>
				</view>
				<view class="public" style="margin-left: 25%;width: 220px;font-size: 27rpx;">优先从所选扣费方式中扣费，余额充足可开启</view>
			</view>
		</view>
		<view class="button" @click="updateStatus">{{ status == 1 ? '开启自动续费' : '关闭自动续费' }}</view>

		<view class="agreement" v-if="status == 1">
			<label class="radio">
				<radio value="r1" :checked="checked" style="transform:scale(0.5);" @click="checkedStatus" />
				你已阅读并同意
				<text>《扣费授权同意书》</text>
			</label>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: '',
			packageContent: '停车后自动扣除停车费',
			status: 0,
			token: '',
			msg: '',
			checked: true
		};
	},
	onLoad() {
		this.token = uni.getStorageSync('userList').accessToken;
		this.status = uni.getStorageSync('autoPayStatus');
		if (!this.status) {
			this.status = 0;
		}
		this.userInfo = uni.getStorageSync('userInfo').nickName;
	},
	methods: {
		checkedStatus() {
			this.checked = this.checked ? false : true;
		},
		updateStatus() {
			if (!this.checked) {
				uni.showToast({
					title: '请先勾选用户协议',
					icon: 'none'
				});
				return false;
			}
			uni.showModal({
				title: '提示',
				content: this.status == 1 ? '确认开启停车场的自动扣费吗?' : '是否关闭停车场的自动扣费?',
				showCancel: true,
				cancelText: '否',
				confirmText: '是',
				success: data => {
					if (data.confirm) {
						uni.showLoading({
							title: '请稍后',
							mask: true
						});
						if (this.status == 1) {
							this.status = 2;
						} else if (this.status == 2) {
							this.status = 1;
						}
						this.$req.request({
							url: 'api/user/updateUserAutoStatus',
							method: 'get',
							data: {
								status: parseInt(this.status)
							},
							success: res => {
								if (res.data.code == 200) {
									if (this.status == 1) {
										uni.showToast({
											title: '关闭自动扣费成功',
											icon: 'none'
										});
									} else if (this.status == 2) {
										uni.showToast({
											title: '开启自动扣费成功',
											icon: 'none'
										});
									}
									uni.removeStorageSync('autoPayStatus');
									uni.setStorageSync('autoPayStatus', this.status);
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
				}
			});
		}
	}
};
</script>

<style>
.father {
	background-color: #ffffff;
}

.title {
	text-align: center;
	padding-top: 10px;
	padding-bottom: 10px;
	font-size: 40rpx;
	font-weight: 600;
	/*border-bottom: 1px solid rgba(192, 192, 192, 0.4);*/
}

.info,
.modalities {
	font-size: 35rpx;
	border-bottom: 1px solid rgba(192, 192, 192, 0.4);
	padding-left: 20px;
}

.public {
	padding-top: 10px;
	padding-bottom: 5px;
	color: #999999;
	/* #ifdef MP-ALIPAY */
	margin: 20rpx 0;
	/* #endif */
}

.public text:nth-of-type(1) {
	color: #000000;
	margin-left: 15px;
}

.public text:nth-of-type(2) {
	color: #000000;
	margin-left: 5px;
}

.button {
	width: 220px;
	margin: 60px auto;
	color: #ffffff;
	background-color: rgb(59, 145, 8);
	text-align: center;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 35rpx;
	border-radius: 20rpx;
}

.agreement {
	color: #000;
	width: 100%;
	text-align: center;
	font-size: 28rpx;
}
.agreement text {
	color: #ff0000;
}
</style>
