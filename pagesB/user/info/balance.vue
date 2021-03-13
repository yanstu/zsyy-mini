<template>
	<view class="balance">
		<view class="number">
			<image mode="aspectFill" src="https://kshht.gzmsdw.cn/imge_zsyy/html/我的余额.png"></image>
			<text>我的余额</text>
			<view>
				<text>￥</text>
				<text>{{ balance / 100 }}</text>
			</view>
		</view>
		<view></view>
		<view class="btn">
			<button @click="recharge" type="primary">充值</button>
			<!-- disabled -->
			<button @click="withdrawal" type="primary">提现</button>
			<view class="foot">
				<text>常见问题</text>
				<text>本服务由码上到位提供</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			balance: 0
		};
	},
	onLoad(option) {
		this.balance = option.balance;
	},
	methods: {
		recharge() {
			if (this.isLogin('../user/info/price', '2')) {
				uni.navigateTo({
					url: 'price?balance=' + this.balance
				});
			}
		},
		withdrawal() {
			if (this.isLogin('../user/info/withdrawal', '2')) {
				uni.navigateTo({
					url: 'withdrawal?balance=' + this.balance
				});
			}
		}
	}
};
</script>

<style>
.balance {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
}
.balance > view {
	flex: 1;
}
.number {
	margin-top: 50rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.number image {
	height: 100rpx;
	width: 100rpx;
}
.number > text {
	margin-top: 50rpx;
}
.number view {
	margin-top: 20rpx;
	position: relative;
}
.number view text:nth-of-type(1) {
	font-size: 60rpx;
	font-weight: bolder;
	position: absolute;
	top: 0;
	left: 0;
}
.number view text:nth-of-type(2) {
	font-size: 70rpx;
	font-weight: bolder;
	margin-left: 55rpx;
}
.btn {
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	position: relative;
	padding-top: 20rpx;
}
.btn button {
	border-radius: 10rpx;
	width: 50%;
	margin: 10rpx;
	height: 70rpx;
	line-height: 70rpx;
}
.btn button:nth-of-type(1) {
	background-color: #00aa60;
	color: #ffffff;
}
.btn button:nth-of-type(2) {
	background-color: #f3f2f3;
	color: #00aa60;
}
.foot {
	position: absolute;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 35rpx;
}
.foot text {
	margin: 10rpx;
	font-size: 25rpx;
}
.foot text:nth-of-type(1) {
	color: blue;
}
.foot text:nth-of-type(2) {
	color: #aaa9ab;
}
</style>
