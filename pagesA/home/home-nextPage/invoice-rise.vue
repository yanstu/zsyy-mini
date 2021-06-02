<!-- 发票抬头 -->
<template>
	<view>
		<!-- 当未设置发票抬头时显示 -->
		<view class="main" v-if="invoiceInfo.length==0" :style="{ 'Height' : (bgHeight-100) + 'px' }">
			<view class="main-content">您未设置发票抬头</view>
			<view class="main-content">
				<view @click="nextPage">
					立即设置
				</view>
			</view>
		</view>
		<!-- 设置发票抬头时显示 -->
		<view class="header" :style="{'height': bgHeight + 'px' }" v-if="invoiceInfo.length!=0">
			<view class="mainContent">
				<view class="invoiceHeader" v-for="(item, index) in invoiceInfo" :key="index" v-if="item[0] || item[1] != undefined"
				 @longtap="del(index)">
					<view>
						{{ item[0] }} <br>
						<text>
							{{ item[1] }}
						</text>
					</view>
					<view>
						>
					</view>
				</view>
			</view>

			<view class="foot">
				<view class="foot-btn" @click="nextPage">添加发票抬头</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgHeight: 0,
				invoiceInfo: []
			}
		},
		onLoad() {
			if (uni.getStorageSync('invoice').length != 0) {
				this.invoiceInfo = uni.getStorageSync('invoice')
			}
		},
		onShow() {
			// 获得下级页面传递上来的参数
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.data.invoiceInfo == []) {
				
			} else if (currPage.data.invoiceInfo.length != 0) {
				this.invoiceInfo.push(currPage.data.invoiceInfo)
				uni.setStorageSync('invoice', this.invoiceInfo)
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.bgHeight = res.windowHeight;
				}
			});
		},
		methods: {
			nextPage() {
				//常用发票添加
				uni.navigateTo({
					url: './invoice-set'
				})
			},

			// 删除
			del(index) {
				let _this = this
				uni.showModal({
					title: '提示',
					content: '确认删除吗？',
					success: function(res) {
						if (res.confirm) {
							_this.invoiceInfo.splice(index, 1)
							uni.setStorageSync('invoice', _this.invoiceInfo)
						} else if (res.cancel) {
							uni.showToast({
								title: '已取消',
								icon: 'none'
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: rgb(242, 243, 245);
	}

	.hide {
		display: none;
	}

	.main {
		height: 90%;
		background: url(https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/发票打印.png) no-repeat center;
		width: 100%;
		color: rgb(138, 138, 138);
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

	.main-content:last-child {
		top: 55%;
	}

	.main-content:last-child view {
		width: 18%;
		border: 1px solid #1C1C1C;
		margin: 0 auto;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		box-shadow: 0.5rpx 0.5rpx 0.5rpx #1C1C1C;
	}

	/* 设置发票抬头之后显示 */

	.header {
		overflow: auto;
	}

	.mainContent {
		margin-top: 5%;
		background-color: rgb(254, 254, 254);
		height: 140rpx;
		width: 100%;

	}

	.invoiceHeader {
		display: flex;
		height: 140rpx;
		justify-content: space-between;
		background-color: rgb(254, 254, 254);
		margin-top: 2%;
	}

	.invoiceHeader view {
		margin: 0 30rpx;
		font-size: 30rpx;
		color: rgb(25, 25, 25);

	}

	.invoiceHeader view:first-child {
		padding-top: 20rpx;
	}

	.invoiceHeader view:last-child {
		line-height: 140rpx;
		font-size: 40rpx;
	}

	.invoiceHeader view text {
		color: rgb(185, 185, 185);
	}

	.foot {
		width: 100%;
		background-color: rgb(254, 254, 254);
		position: absolute;
		bottom: 0;
		height: 150rpx;
	}

	.foot-btn {
		margin: 2.5% auto;
		width: 90%;
		height: 120rpx;
		background-color: rgb(73, 75, 90);
		border-radius: 10rpx;
		color: rgb(230, 232, 233);
		text-align: center;
		line-height: 120rpx;
		font-size: 40rpx;
	}
</style>
