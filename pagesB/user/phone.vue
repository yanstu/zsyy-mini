<template>
	<view>
		<view v-if="canIUse">
			<view class='header'>
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/logo.png"></image>
			</view>
			<view class='content'>
				<view>申请获取以下权限</view>
				<text>请允许获得你的手机号码</text>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class='bottom' open-type="getPhoneNumber" type="primary" @getphonenumber="getPhoneNumber">手机号授权</button>
			<!-- #endif -->
		</view>
		<view v-else>请升级微信版本</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				canIUse: uni.canIUse('button.open-type.getUserInfo'),
			};
		},
		onLoad(options) {},
		methods: {
			getPhoneNumber(e) {
				if (!e.detail.iv) {
					uni.showToast({
						title: '授权失败',
						icon: 'none',
						});
					return false
				}
				uni.showLoading({
					title:'请稍后',
					mask:true
				})
				this.$req.request({
					url: 'api/user/miniInfoDecode',
					data: {
						'encryptedData': e.detail.encryptedData,
						'iv': e.detail.iv
					},
					success: res => {
						if (res.data.code == 200) {
							this.$req.request({
								url: 'api/user/syncUserInfo',
								data: {
									phone: JSON.parse(res.data.data).phoneNumber,
								},
								success: result => {
									console.log(result)
									if (result.data.code == 200) {
										let userList=uni.getStorageSync("userList")
										userList={...userList,'phone':JSON.parse(res.data.data).phoneNumber}
										uni.setStorageSync("userList",userList)
										uni.navigateBack({
											delta:1
										})
									} else {
										uni.showToast({
											title: result.data.msg,
											icon: 'none'
										});
									}
								},
								complete: data => {}
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {uni.hideLoading()}
				})
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hot_free {
		margin: 40rpx 0rpx 20rpx 0rpx;
		padding: 0rpx 20rpx;
		display: flex;
		align-items: center;
	}

	.hot_free text:nth-child(1) {
		font-size: 35rpx;
		font-weight: 700;
		text-align: left;
	}

	.hot_free text:nth-child(2) {
		margin-left: 40rpx;
		font-size: 25rpx;
		color: #808080;
	}

	.tobtn {
		margin-top: 30rpx;
		height: 88rpx;
		width: 583rpx;
		border-radius: 50rpx;
		background-color: rgb(63, 191, 191);
		text-align: center;
		line-height: 88rpx;
		color: white;
		box-shadow: 0rpx 5rpx 10rpx #a2a2a2;
	}

	.login {
		margin-top: 100px;
	}

	.header {
		border-bottom: 1px solid #ccc;
		text-align: center;
		width: 100%;
		height: 300rpx;
		line-height: 450rpx;
	}

	.header image {
		width: 150rpx;
		height: 150rpx;
	}

	.content {
		margin-left: 50rpx;
		margin-bottom: 90rpx;
	}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.bottom {
		border-radius: 80rpx;
		margin: 70rpx 50rpx;
		font-size: 35rpx;
	}

	.title {
		display: flex;
		align-items: center;
		/* padding: 30rpx; */
		margin: auto;
		height: 260rpx;
		/* border: 1px solid red; */
		flex-direction: column;

	}

	.title image {
		height: 150rpx;
		width: 150rpx;
		border-radius: 50%;
		border: 1px solid #CCCCCC;
		margin-right: 38%;
	}
</style>
