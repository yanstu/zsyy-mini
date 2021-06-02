<template>
	<view>
		<input type="text" v-model="name" class="input" />
		<view class="box">请输入你想要修改的昵称</view>
		<view class="box-btn" @click="updateUserInfo">保存</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			token: ''
		};
	},
	onLoad(option) {
		this.name = option.name;
		this.token = uni.getStorageSync('userList').accessToken;
	},
	methods: {
		updateUserInfo() {
			console.log('name');
			console.log(this.name);
			this.$req.request({
				url: 'api/user/syncUserInfo',
				data: {
					nickname: this.name
				},
				success: res => {
					if (res.data.code == 200) {
						uni.setStorageSync('userList', res.data.data);
						uni.navigateBack();
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
	}
};
</script>

<style>
.input {
	width: 90%;
	border-bottom: 1px solid rgba(192, 192, 192, 0.3);
	margin: 0 auto;
	height: 80rpx;
	line-height: 80rpx;
}
.box {
	width: 90%;
	margin: 0 auto;
	height: 60rpx;
	line-height: 60rpx;
	color: rgb(164, 164, 164);
}
.box-btn {
	width: 90%;
	margin: 0 auto;
	height: 80rpx;
	line-height: 80rpx;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	text-align: center;
	border-radius: 15rpx;
	font-size: 40rpx;
	margin-top: 100rpx;
}
</style>
