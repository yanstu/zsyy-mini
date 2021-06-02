<!--  社区通知 -->
<template>
	<view>
		<view class="box-no" v-if="notifications.length <= 0"><van-empty description="暂无通知" /></view>
		<view v-else class="box" @tap="gomore(item.id)" v-for="(item, index) in notifications" :key="index">
			<view class="box-head">
				<view class="box-title">通知：</view>
				<view class="box-text">
					查看更多内容
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="box-content">{{ item.title }}</view>
			<view class="box-foot">{{ item.updatetime }}</view>
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
			notifications: []
		};
	},
	onLoad() {
		if (uni.getStorageSync('notifications')) {
			this.notifications = uni.getStorageSync('notifications');
		}
	},
	methods: {
		gomore(id) {
			uni.navigateTo({
				url: 'districtNotice_son?id=' + id
			});
		}
	}
};
</script>

<style>
.box {
	width: 97%;
	background-color: #ffffff;
	border-radius: 5rpx;
	margin: 0 auto;
	margin-top: 15rpx;
	padding: 20rpx;
	height: 7rem;
	position: relative;
}
.box-head {
	display: flex;
	justify-content: space-between;
}
.box-content {
	width: 95%;
	margin: 0 auto;
	text-align: left;
	margin-top: 20rpx;
}
.box-title {
	color: #000000;
}
.box-foot {
	position: absolute;
	bottom: 10rpx;
	right: 10rpx;
}
.box-no {
	font-size: 44rpx;
	color: #c0c0c0;
	padding-top: 40rpx;
	text-align: center;
}
</style>
