<!-- 服务详情 -->
<template>
	<view style="height: 100%;">
		<view class="bg-white border title">
			订单号：{{order.orderNo?order.orderNo:' '}}
		</view>
		<view class="bg-white border margin-top">
			<view class="action tips">
				<text class="cuIcon-title text-blue"></text>服务项目
			</view>
		</view>
		<view class=" border">
			<view class="cuIcon-circle info"><text>{{order.orderProduct.courseName}}</text></view>
		</view>
		<view class="bg-white border margin-top">
			<view class="action tips">
				<text class="cuIcon-title text-blue"></text>服务信息
			</view>
		</view>
		<view class="border">
			<view class="cuIcon-time info"><text>{{order.createtime}}</text></view>
		</view>
		<view class=" border">
			<view class="cuIcon-location info"><text>{{order.address}}</text></view>
		</view>
		<view class=" border">
			<view class="cuIcon-phone info"><text>{{order.phone}}</text></view>
		</view>
		<!--  -->
		<view class="border margin-top">
			<view class="action tips">
				<text class="cuIcon-title text-blue"></text>订单进度
			</view>
		</view>
		<view class="border flex justify-between">
			<view class="text1"><text>{{order.updatetime}}</text></view>
			<view class="text2"><text>{{order.status}}</text></view>
		</view>
		<!--  -->
		<view class="border margin-top">
			<view class="action tips">
				<text class="cuIcon-title text-blue "></text>订单金额
			</view>
		</view>
		<view class="flex justify-between border">
			<view class="text1"><text>{{order.orderProduct.courseName}}</text></view>
			<view class="text2"><text>￥{{order.actualPrice/100}}</text></view>
		</view>
		<view class="flex foot">
			<view><button @click="cancelOrder" class="cancelOrder">取消服务</button></view>
			<view><button @click="pay" class="pay">立即支付</button></view>
		</view>
	</view>
</template>

<script>
	import SOtime from '@/js_sdk/fl-SOtime/SOtime.js'
	export default {
		data() {
			return {
				orderId: 0,
				token: '',
				order: null,
				status: 0
			}
		},
		onLoad(option) {
		
			this.token = uni.getStorageSync("userList").accessToken
			uni.showLoading({
				title: '正在加载',
				mask: true
			})
			this.orderId=option.orderId
			this.getOrderDetail(option.orderId);
		},
		methods: {
			getOrderDetail(orderId) {
				this.$req.request({
					url: 'api/order/getOrderDetail',
					data: {
						orderId:orderId
					},
					success: res => {
						if (res.data.code == 200) {
							this.order = res.data.data
							this.order.createtime = SOtime.time3(this.order.createtime)
							this.order.updatetime = SOtime.time3(this.order.updatetime)
							if (this.order.status == 1) {
								this.order.status = '待支付'
							} else if (this.order.status == 2) {
								this.order.status = '已支付'
							} else if (this.order.status == 3) {
								this.order.status = '已取消'
							} else if (this.order.status == 4) {
								this.order.status = '已取消'
							} else if (this.order.status == 5) {
								this.order.status = '已完成'
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {
						uni.hideLoading();
					}
				})
			},
			/* 取消服务 */
			cancelOrder() {
				uni.showModal({
					title: '提示',
					content: '确定取消服务吗?',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.$req.request({
								url: 'api/order/cancalOrder',
								data: {
									'orderId': this.orderId
								},
								success: res => {
									if (res.data.code == 200) {
										uni.showToast({
											title: '取消成功',
											icon: 'none'
										});
										setTimeout(function() {
											uni.navigateBack()
										}, 1000)
										
									} else {
										uni.showToast({
											title: res.data.msg,
											icon: 'none'
										});
									}
								},
								complete: data => {}
							})
						}
					},
				});

			},
			pay() {
				uni.redirectTo({
					url: '../pay/pay?orderNo=' + this.order.orderNo + '&actualPrice=' + this.order.actualPrice / 100+'&type=1'
				});
			}
		},
		filters: {
			formatDate: function(value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + '' + h + ':' + m + ':' + s;
			}

		}

	}
</script>

<style>
	.foot {
		width: 750upx;
		position: fixed;
		bottom: 0rpx;
	}

	.foot view {
		width: 50%;
	}

	.cancelOrder {
		border-radius: 0;
		background-color: #FF0000;
		color: #FFF;
	}

	.pay {
		border-radius: 0;
		background-color: rgb(59,145,8);
		color: #FFF;
	}

	.border {
		border-bottom: 1px solid #CCCCCC;
		padding-top: 15upx;
		padding-bottom: 15upx;
		background-color: #FFFFFF;
	}

	.info {
		margin-left: 15upx;
		color: #000000;
	}

	.info text {
		margin-left: 15upx;
	}

	.text1 {
		margin-left: 30upx;
	}

	.text2 {
		margin-right: 30upx;
		color: #FF0000;
	}

	.title {
		padding-top: 16upx;
		padding-bottom: 16upx;
		text-align: center;
		font-size: 30upx;
		font-weight: 700;
		color: #000000;
	}

	.tips {
		color: #315edd;
		padding-left: 15upx;
	}

	.car {
		margin-left: 15upx;
		padding-top: 15upx;
		padding-bottom: 15upx;
	}
</style>
