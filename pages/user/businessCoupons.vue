<template>
	<view style="position: relative;">


		<!-- 二维码 -->
		<view class="twoCode" v-if="(imgSrc != '')">
			<view style="margin-top: 50%; position: relative; background: white; height: 500rpx; width: 500rpx;">
				<view v-if="show" style="width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); z-index: 99;">
					<image style="width: 200rpx; height: 200rpx; display: block; margin: 28% auto;"
						src="http://file.gzmsdw.cn/zsyy/d1be4920a99b4bab980986a9dfb59ba0.png" mode=""></image>
						<!-- 刷新 -->
					<image @click="refresh" src="http://file.gzmsdw.cn/zsyy/d5a501134ee14fe69d3d0b333385d2ef.png" mode="" style="width: 90rpx; height: 90rpx; position: absolute; bottom: 30rpx;left: 0;right: 0;margin: auto;"></image>
				</view>
				<image :src="imgSrc" mode=""></image>
				<!-- 关闭 -->
				<image @click="close" src="http://file.gzmsdw.cn/zsyy/bc3d3a73d86847f3bc7064dc02ca7618.png" mode=""
					style="width: 150rpx; height: 150rpx; display: block; margin: 0 auto;"></image>
			</view>
		</view>


		<view>
			<view v-if="!coupon.length > 0" class="coupon-no">
				<van-empty description="暂时没有未使用的优惠券" />
			</view>
			<view v-for="(items, index1) in coupon" :key="index1" class="text scroll-view-item" v-else>
				<view class="view1">
					<view class="view1-symbol"><text>￥</text></view>
					<view class="view1-price">
						{{ items.discount /100}}
						<!-- <text>
							{{items.discount}}
						</text> -->
					</view>
				</view>
				<view class="conponInfo">
					<view class="conponTitle">{{ items.title }}</view>
					<view class="full" v-if="items.min != undefined">满{{ items.min /100 }}元使用</view>
					<view class="full" v-if="(items.max != undefined && items.max != 0 ) ">最低消费{{ items.max /100 }}元使用
					</view>
					<view class="full" v-if="(items.max == items.min)">可直接使用</view>
					<view class="timeSpent">有效期至 {{ $req.formatDate(items.gmtEnd) }}</view>
				</view>
				<view class="immediateReceipt"><button @click="share(index1)" type="default" size="mini" plain="true" style="color: white;background-color: #F8DA8C;border: none;">分享用户</button></view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				coupon: '',
				userId: '',
				imgSrc: '',
				show: false,
				index: null, //刷新按钮
				
			}
		},
		onLoad() {
			console.log(uni.getStorageSync('userList'))
			this.token = uni.getStorageSync('userList').accessToken;
			this.userId = uni.getStorageSync('userList').id
			this.getCoupon()
		},
		methods: {
			// 获得优惠券
			getCoupon() {
				this.$req.request({
					url: '/api/coupon/getUserCourse',
					data: {
						isType: 3,
						status: 2,
						userId: this.userId,
						accessToken: this.token
					},
					method: 'GET',
					success: res => {
						if (res.data.code == 200) {
							this.coupon = res.data.data;
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {}
				});
			},
			// 分享
			share(index) {
				this.index = index;
				if(this.coupon[index].url == '') {
					this.$req.request({
						url: '/api/coupon/generateFile',
						data: {
							id: this.coupon[index].id,
							accessToken: this.token
						},
						method: 'GET',
						success: res => {
							if (res.data.code == 200) {
								// console.log(res.data.data)
								this.coupon[index] = res.data.data
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						},
						complete: data => {}
					});
				} else {
					this.imgSrc = this.coupon[index].url
				}
				setTimeout(() => {
					// 遮笼罩
					this.show = true;
					// 二维码删除
					this.$req.request({
						url: '/api/coupon/deleteFile',
						data: {
							path: this.coupon[index].url,
							id: this.coupon[index].id,
							accessToken: this.token
						},
						method: 'GET',
						success: res => {
							if (res.data.code == 200) {
								// console.log(res.data)
							} else {
								// uni.showToast({
								// 	title: res.data.msg,
								// 	icon: 'none'
								// });
							}
						},
						complete: data => {}
					});
				}, 60000)
				// uni.navigateTo({
				// 	url: '../proper/coupon?tId=' + this.coupon[index].id
				// })
			},
			// 关闭
			close() {
				this.show = false;
				this.imgSrc = '';
			},
			// 刷新
			refresh() {
				this.share(this.index);
				this.show = false;
			}
		}
	}
</script>

<style>
	.page {
		padding-top: 69px;
	}

	.cu-item {
		width: 50%;
		color: #000000;
	}

	.coupon-no {
		font-size: 40rpx;
		color: rgb(150, 150, 150);
		text-align: center;
	}

	.text {
		background-color: #f1505c;
		height: 167rpx;
		color: #777;
		border-radius: 15px;
		margin-bottom: 40rpx;
		margin-left: 5px;
		margin-right: 5px;
		overflow: hidden;
		display: flex;
	}

	.view1 {
		height: 100%;
		width: 25%;
		color: #f8da8c;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.view1-symbol {
		height: 80%;
		width: 30%;
		position: relative;
		text-align: right;
	}

	.view1-symbol text {
		position: absolute;
		bottom: 18px;
		left: 0px;
		right: 0px;
		font-size: 30rpx;
	}

	.view1-price {
		height: 80%;
		width: 60%;
		font-size: 70rpx;
		line-height: 133rpx;
		font-weight: 700;
		/* position: relative; */
	}

	.conponInfo {
		margin-left: 20rpx;
		height: 100%;
		color: #ffffff;
		width: 40%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.conponTitle {
		font-size: 30rpx;
		font-weight: 700;
	}

	.full {
		font-size: 30rpx;
	}

	.timeSpent {
		font-size: 20rpx;
	}

	.immediateReceipt {
		height: 100%;
		width: 30%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.immediateReceipt button {
		height: 75rpx;
		width: 100%;
		border-radius: 20px;
		text-align: center;
		line-height: 75rpx;
		font-size: 30rpx;
		font-weight: 700;
		color: #fe4a4d;
	}

	.select {
		border-bottom: 1px solid rgb(59, 145, 8);
	}

	.twoCode {
		width: 100%;
		height: 100%;
		background: rgba(241, 241, 241, 0.4);
		position: absolute;
		z-index: 999 !important;
	}

	.twoCode view {
		position: absolute;
		width: 70%;
		height: 50%;
		bottom: 0;
		top: 0;
		left: 0;
		right: 0;
		margin: auto;
	}

	.twoCode view image {
		width: 100%;
		height: 100%;
	}
</style>
