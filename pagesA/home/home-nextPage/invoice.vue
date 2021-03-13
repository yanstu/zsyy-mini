
<!-- 发票管理页面 -->

<template>
	<view>
		<view>
			<view class="title">以下服务由码上到位提供支持</view>
			<view class="main">
				<view v-for="(item, index) in list" :key="index" @click="nextPage(index)">
					<view class="main-text">
						<view>{{ item.name }}</view>
						<view> > </view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data () {
			return {
				list: [
					{name:'平台消费开票'},
					{name:'常用发票抬头'},
					{name:'开票历史'}
				]
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			});
		},
		onReady() {
			uni.hideLoading();
		},
		methods: {
			nextPage(e) {
				if(e == 0) {
					//平台消费开票
					uni.navigateTo({
						url: './invoice-platform'
					})
				} else if (e == 1) {
					uni.navigateTo({
						url: './invoice-rise'
					})
				}
			}
		}
	}
</script>

<style>
	
	page {
		background-color: rgba(242,243,245);
	}
	
	.title {
		font-size: 20px;
		font-weight: bold;
		text-align: center;
		margin: 20rpx auto;
	}
	
	
	.main-text {
		background-color: rgb(254,254,254);
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		margin-top: 1rpx;
		padding-left: 30rpx;
	}
	.main-text view:last-child {
		margin-right: 5%;
	}
	
</style>
