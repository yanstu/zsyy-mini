<template>
	<view>
		<view class="header">{{ title }}</view>
		<view class="container">
			<view>{{ content }}</view>
			<view class="img">
				<image :src="image[0][0]" mode=""></image>
				<image :src="image[0][1]" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				image: []
			}
		},
		onLoad(option) {
			this.title = option.title
			this.content = option.content
			if(option.image) {
				this.image.push(option.image.split(","))
			}
		}
	}
</script>

<style>
	page {
		background-color: rgb(255,255,255);
	}
	.header {
		height: 80rpx;
		width: 90%;
		border-bottom: 1px solid rgb(247,247,247);
		margin: 0 auto;
		color: rgb(117,117,117);
		line-height: 80rpx;
	}
	.container {
		width: 90%;
		height: 600rpx;
		margin: 0 auto;
		color: rgb(158,158,164);
		margin-top: 20rpx;
	}
	.img image { 
		height: 600rpx;
		width: 45%;
		margin-top: 20rpx;
	}
	.img image:last-child {
		margin-left: 7%;
	}
</style>
