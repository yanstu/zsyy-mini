<template>
	<view class="page">
		<scroll-view class="bg-white nav text-center fixed" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'select' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">{{ tabNav[index] }}</view>
		</scroll-view>
		<view v-if="TabCur == 0">
			<view v-if="!taskList.length > 0" class="coupon-no"><van-empty description="暂时没有未使用的优惠券" /></view>
			<view v-for="(items, index1) in taskList" :key="index1" class="text scroll-view-item" v-else>
				<view class="view1">
					<view class="view1-symbol"><text>￥</text></view>
					<view class="view1-price">
						{{ items.discount }}
						<!-- <text>
							{{items.discount}}
						</text> -->
					</view>
				</view>
				<view class="conponInfo">
					<view class="conponTitle">{{ items.title }}</view>
					<view class="full">满{{ items.min }}元使用</view>
					<view class="timeSpent">有效期至 {{ $req.formatDate(items.gmtEnd) }}</view>
				</view>
				<view class="immediateReceipt"><button type="default" size="mini" plain="true" style="color: white;background-color: #F8DA8C;border: none;">去使用</button></view>
			</view>
		</view>
		<view v-if="TabCur == 1">
			<view v-if="!taskList2.length > 0" class="coupon-no"><van-empty description="暂时没有未使用的优惠券" /></view>
			<view v-for="(items, index1) in taskList2" :key="index1" class="text scroll-view-item uni-bg-red" style="background: #7d7d7d;" v-else>
				<view class="view1">
					<view class="view1-symbol"><text>￥</text></view>
					<view class="view1-price">
						<text>{{ items.discount }}</text>
					</view>
				</view>
				<view class="conponInfo">
					<view class="conponTitle">{{ items.title }}</view>
					<view class="full">满{{ items.min }}元使用</view>
					<view class="timeSpent">有效期至{{ items.gmtEnd | formatDate }}</view>
				</view>
				<view class="immediateReceipt">
					<button type="default" size="mini" plain="true" style="color: #7d7d7d;background-color: #F0F0F0;border: none;">{{ off ? '未使用' : '已使用' }}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			TabCur: 0,
			tabNav: ['未使用', '已使用'],
			taskList: [],
			taskList2: [],
			token: ''
		};
	},
	onLoad(option) {
		this.token = uni.getStorageSync('userList').accessToken;
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		if (option.tId) {
			this.getCouponByUidAndTid(option.tId);
		} else {
			this.getUserCoupon();
		}
		this.getUserCoupon2();
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;
		},
		/* 获取优惠券信息 */
		getCouponByUidAndTid(courseId) {
			this.$req.request({
				url: 'api/coupon/getCouponByUidAndTid/' + courseId,
				method: 'GET',
				success: res => {
					if (res.data.code == 200) {
						this.taskList = res.data.data;
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
		/* 未使用 */
		getUserCoupon() {
			this.$req.request({
				url: 'api/coupon/getUserCoupons',
				data: {
					status: 1
				},
				success: res => {
					if (res.data.code == 200) {
						this.taskList = res.data.data;
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
		/* 已使用 */
		getUserCoupon2() {
			this.$req.request({
				url: 'api/coupon/getUserCoupons',
				data: {
					status: 2
				},
				success: res => {
					if (res.data.code == 200) {
						this.taskList2 = res.data.data;
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
			});
		},
		/* 使用优惠券 */
		useCoupon(coupon) {
			if (coupon.collectionDate) {
				//洗车预约
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.coupon = coupon; //修改上一页coupon里面参数值
				uni.navigateBack({
					delta: 1
				});
			} else {
				if (coupon.courseId == 1) {
					uni.setStorageSync('courseId', coupon.courseId);
					uni.navigateTo({
						url: '../../proper/carWashBooking'
					});
				} else if (coupon.courseId == 2) {
					uni.setStorageSync('courseId', coupon.courseId);
					uni.navigateTo({
						url: '../../proper/cleaning'
					});
				} else {
					uni.showToast({
						title: '该优惠券没有对应产品',
						icon: 'none'
					});
				}
			}
		}
	},
	filters: {
		formatDate: function(value) {
			let date = new Date(value);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? '0' + MM : MM;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;
			let h = date.getHours();
			h = h < 10 ? '0' + h : h;
			let m = date.getMinutes();
			m = m < 10 ? '0' + m : m;
			let s = date.getSeconds();
			s = s < 10 ? '0' + s : s;
			return y + '-' + MM + '-' + d + '' + h + ':' + m + ':' + s;
		}
	}
};
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

/* .view1-price text{
			position:absolute ;
			bottom: 0px;
			left: 0px;
			right: 0px;
		} */

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
</style>
