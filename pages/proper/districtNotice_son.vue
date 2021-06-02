<template>
	<view class="content">
		<view class="box">
			<view class="box-title"><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/标题.png" style="width: 40rpx;height: 40rpx;margin-right: 15rpx;" mode=""></image> {{ notification.title }}</view>
			<view class="box-remark">{{ notification.remark }}</view>
			<view class="box-content">
				<text space="emsp">{{ notification.detail }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			notification: null
		};
	},
	onLoad(option) {
		var notifications = uni.getStorageSync('notifications');
		for (var s of notifications) {
			if (option.id == s.id) {
				this.notification = s;
			}
		}
	}
};
</script>

<style>
.content {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.box {
	width: 98%;
	margin: auto;
	padding: 15rpx;
	background-color: #ffffff;
	height: 98%;
	overflow-y: scroll;
}

.box-title {
	margin-top: 20rpx;
	font-size: 40rpx;
	color: #000000;
}

.box-remark {
	margin-top: 25rpx;
	font-size: 25rpx;
	color: #000000;
	margin-bottom: 50rpx;
}

.box-content {
	width: 95%;
	margin: 0 auto;
}
.box-content text{
	font-size: 30rpx;
}
</style>
