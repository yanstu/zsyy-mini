<!-- 平台消费开票 -->


<template>
	<view>
		<view class="main" :style="{ 'Height' : (bgHeight-100) + 'px' }">
			<view class="main-content">您还没有可开发票的订单</view>
		</view>
		<!-- 底部状态 -->
		<view class="foot">
			<view class="foot-top"><text>0</text>个行程,共<text>0.00</text>元</view>
			<view class="foot-main">
				<view >
					<checkbox class="foot-main-checkbox"></checkbox>
					本页全选
				</view>
				<view>
					<checkbox class="foot-main-checkbox"></checkbox>
					全部全选
				</view>
				<view>
					<view class="foot-main-btn">下一步</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				bgHeight: 0
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.bgHeight = res.windowHeight;
				}
			});
		},
	}
</script>

<style>
	page {
		margin: 0;
		padding: 0;
		background-color: rgb(242,243,245);
	}
	
	.main {
		height: 90%;
		background: url(https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/发票打印.png) no-repeat center;
		width: 100%; 
		color: rgb(138,138,138);
		text-align: center;
		
	}
	.main-content {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
	
	.foot {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.foot-top {
		background-color: rgb(249,249,249);
		height: 60rpx;
		width: 100%;
		padding-left: 40rpx;
		line-height: 60rpx;
	}
	.foot-top text {
		color: rgb(249,168,121);
	}
	.foot-main {
		margin-top: 1rpx;
		display: flex;
		justify-content: space-around;
		background-color: rgb(249,249,249);
	}
	.foot-main view {
		width: 30%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
		align-items: center;
		color: rgb(138,138,138);
		font-size: 15px;
	}
	.foot-main-checkbox {
		margin-right: 10px;
	}
	.foot-main-btn {
		display: block !important;
		width: 70% !important;
		height: 50% !important;
		line-height: 100rpx !important;
		margin: 25% auto;
		background-color: rgba(203,203,203);
		color: rgb(250,250,250) !important;
		border-radius: 10rpx;
	}
</style>
