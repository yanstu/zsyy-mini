<template>
	<view>
		<!-- <view v-if="canIUse"> -->
		<view class="header"><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/logo.png"></image></view>
		<view class="content">
			<view>申请获取以下权限</view>
			<text>请依次允许获得你的公开信息及手机号码</text>
		</view>
		<view class="btns">
			<!-- #ifdef MP-WEIXIN -->
			<button :loading="loginLoading" class="tobtn" type="primary" v-if="!isLogin" open-type="getUserInfo" @getuserinfo="getUserInfo" withCredentials="true">微信登录</button>
			<button :loading="phoneLoading" class="tobtn" open-type="getPhoneNumber" v-else @getphonenumber="getPhoneNumber">手机号授权</button>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<button :loading="loginLoading" class="tobtn" v-if="!isLogin" @getAuthorize="onGetAuthorize" @error="errorAuthorize" scope="userInfo" open-type="getAuthorize">
				支付宝登录
			</button>
			<button :loading="phoneLoading" class="tobtn" scope="phoneNumber" open-type="getPhoneNumber" v-else @getphonenumber="getPhoneNumber">手机号授权</button>
			<!-- #endif -->
			<button class="tobtn" @click="toHome">返回首页</button>
		</view>
		<!-- </view>
		<view v-else>请升级微信版本</view> -->
	</view>
</template>
<script>
var log = require('../../util/log.js');
export default {
	data() {
		return {
			SessionKey: '',
			OpenId: '',
			nickName: '',
			avatarUrl: '', //默认为true
			isPhone: true,
			canIUse: uni.canIUse('button.open-type.getUserInfo'),
			isLogin: false,
			backtype: 0,
			loginLoading: false,
			phoneLoading: false
		};
	},
	onLoad(option) {
		this.backtype = option.backtype;
		this.loginStatus();
	},
	methods: {
		onGetAuthorize(data) {
			this.loginLoading = true;
			uni.login({
				provider: 'alipay',
				success: res => {
					console.log(res);
					uni.getUserInfo({
						provider: 'alipay',
						success: result => {
							console.log(result);
							uni.setStorageSync('userInfo', result.userInfo);
							this.login(res.code);
						}
					});
				}
			});
			this.loginStatus();
		},
		errorAuthorize() {
			my.alert({
				content: '你取消了授权，登录失败'
			});
			this.loginLoading = false;
		},
		loginStatus() {
			this.isLogin = uni.getStorageSync('userList') != '';
		},
		toHome() {
			uni.reLaunch({
				url: '../home/home'
			});
		},
		getUserInfo(data) {
			this.loginLoading = true;
			if (!data.detail.iv) {
				uni.showToast({
					title: '你取消了授权，登录失败',
					icon: 'none'
				});
				this.loginLoading = false;
				return false;
			}
			uni.login({
				provider: 'weixin',
				success: res => {
					uni.getUserInfo({
						provider: 'weixin',
						success: result => {
							uni.setStorageSync('userInfo', result.userInfo);
							this.login(res.code);
						}
					});
				}
			});
			this.loginStatus();
		},
		login(code) {
			this.$req.request({
				url: 'api/user/miniLogin?jsCode=' + code,
				success: res => {
					if (res.data.code == 200) {
						this.setMassage('登陆成功');
						this.loginStatus();
						uni.setStorageSync('autoPayStatus', res.data.data.autoPayStatus);
						if (res.data.data.nickname) {
							let userInfo = uni.getStorageSync('userInfo');
							userInfo.nickName = res.data.data.nickname;
							uni.setStorageSync('userInfo', userInfo);
						}
						this.midd(res.data.data.accessToken);
					} else {
						uni.removeStorageSync('userInfo');
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.loginLoading = false;
					}
				},
				complete: data => {}
			});
		},
		async midd(accessToken) {
			const result = await this.syncUserInfo(accessToken);
			if (result.data.code == 200) {
				uni.setStorageSync('userList', result.data.data);
			} else {
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('autoPayStatus');
				uni.showToast({
					title: result.data.msg,
					icon: 'none'
				});
			}
			this.loginLoading = false;
			this.goPage();
		},

		goPage() {
			if (this.backtype == 1) {
				uni.switchTab({
					url: '../home/home'
				});
			} else {
				uni.navigateBack({
					delta: 1
				});
			}
		},

		syncUserInfo(token) {
			let userInfo = uni.getStorageSync('userInfo');
			return new Promise((resolve, reject) => {
				this.$req.request({
					url: 'api/user/syncUserInfo',
					header: {
						accessToken: token,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					data: {
						avatarUrl: userInfo.avatarUrl,
						gender: userInfo.gender,
						nickname: userInfo.nickName
					},
					success: result => {
						resolve(result);
					},
					complete: data => {
						uni.hideLoading();
					}
				});
			});
		},
		getPhoneNumber(e) {
			this.phoneLoading = true;
			if (!e.detail.iv) {
				uni.showToast({
					title: '授权失败,部分功能可能不可用',
					icon: 'none',
					success: res => {
						setTimeout(() => {
							if (this.backtype == 2) {
								uni.redirectTo({
									url: this.backpage
								});
							} else if (this.backtype == 3) {
								uni.switchTab({
									url: this.backpage
								});
							}
						}, 1500);
					}
				});
				this.phoneLoading = false;
				return false;
			}
			this.$req.request({
				url: 'api/user/miniInfoDecode',
				header: {
					accessToken: uni.getStorageSync('userList').accessToken,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				data: {
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv
				},
				success: res => {
					if (res.data.code == 200) {
						this.midd2(JSON.parse(res.data.data).phoneNumber);
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.phoneLoading = false;
					}
				},
				complete: data => {}
			});
		},
		async midd2(phone) {
			const result = await this.syncUserInfo2(phone);
			if (result.data.code == 200) {
				let userList = uni.getStorageSync('userList');
				userList = { ...userList, phone: phone };
				uni.setStorageSync('userList', userList);
			} else {
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('userList');
				uni.removeStorageSync('autoPayStatus');
				uni.showToast({
					title: result.data.msg,
					icon: 'none'
				});
			}
			this.phoneLoading = false;
			this.goPage();
		},
		syncUserInfo2(phone) {
			return new Promise((resolve, reject) => {
				this.$req.request({
					url: 'api/user/syncUserInfo',
					header: {
						accessToken: uni.getStorageSync('userList').accessToken,
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					data: {
						phone: phone
					},
					success: result => {
						resolve(result);
					},
					complete: data => {
						uni.hideLoading();
					}
				});
			});
		}
	}
};
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
	background: #53cd29;
	text-align: center;
	line-height: 88rpx;
	color: white;
	box-shadow: 0rpx 5rpx 10rpx #a2a2a2;
}
.btns {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.login {
	margin-top: 100px;
}

.header {
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
	border: 1px solid #cccccc;
	margin-right: 38%;
}
</style>
