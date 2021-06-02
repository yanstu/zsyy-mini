<!-- 洗车预约 -->
<template>
	<view class="content">
		<form>
			<view class="cu-form-group  cu-bar">
				<view>地址选择:</view>
				<view class="action text-right" @click="goAddressSel">
					{{ addressData.address == null ? '选择' : addressData.address }}
					<text class="cuIcon-right"></text>
				</view>
			</view>

			<view class="cu-form-group ">
				<view class="title flex car-item">
					<view>资费:</view>
					<view>￥{{ price / 100 }}</view>
				</view>
			</view>

			<view class="cu-form-group ">
				<view class="title flex car-item">
					<view>描述:</view>
					<view>{{ digest }}</view>
				</view>
			</view>

			<view class="cu-form-group">
				<view class="title">日期选择</view>
				<picker mode="date" :value="date" :start="dataStart" @change="DateChange">
					<view class="picker">{{ date }}</view>
				</picker>
			</view>

			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" start="09:00" :end="endTime" @change="TimeChange">
					<view class="picker">{{ time }}</view>
				</picker>
			</view>
			<view class="cu-form-group  cu-bar">
				<view>优惠券:</view>
				<view class="action text-right text-red" @click="goCoupon">
					{{ coupon != null ? coupon.title : couponName }}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group align-start" style="background-color: rgb(242,242,242);"><view class="title">备注</view></view>
			<textarea maxlength="-1" @input="textareaBInput" placeholder="备注" v-model="textareaBValue" class="textarea"></textarea>
		</form>
		<view class="btn" @click="booking">预约</view>
	</view>
</template>

<script>
import SOtime from '@/js_sdk/fl-SOtime/SOtime.js';
export default {
	data() {
		return {
			date: '',
			time: '',
			name: '',
			courseId: null,
			pageNo: 1,
			pageSize: 100,
			digest: '',
			price: null,
			textareaBValue: '',
			addressId: null,
			token: '',
			addressData: null,
			dataStart: null,
			isAddDate: false,
			endTime: '18:00',
			couponName: '',
			tId: null,
			coupon: null
		};
	},
	onLoad(option) {
		this.token = uni.getStorageSync('userList').accessToken;
		if (this.getHours() > 18 && this.getHours() <= 23) {
			this.time = '09' + ':' + this.getMinutes();
			this.isAddDate = true;
			this.date = this.getDate();
			this.dataStart = this.getDate();
		} else if (this.getHours() < 9) {
			this.time = '09' + ':' + this.getMinutes();
			this.date = this.getDate();
			this.dataStart = this.getDate();
			this.isAddDate = false;
		} else {
			this.time = this.getHours() + 2 + ':' + this.getMinutes();
			if (this.getHours() + 2 >= 18) {
				this.endTime = this.time;
			}
			this.isAddDate = false;
			this.date = this.getDate();
			this.dataStart = this.getDate();
		}
		uni.showLoading({
			title: '加载中',
			mask: true
		});
		/*let courseList = uni.getStorageSync('courseList');
		if (!courseList) {
			// 获取所有服务
			this.$req.request({
				url: 'api/commom/getAllCourseList',
				method: 'get',
				success: res => {
					if (res.data.code == 200) {
						uni.setStorageSync('courseList', res.data.data);
						const value = res.data.data[0].id;
						this.getProductList(value);
						this.getCouponByUidAndTid(value);
						this.tId = value;
					} else {
						uni.showToast({
							title: resd.data.msg,
							icon: 'none'
						});
						setTimeout(() => {
							uni.hideLoading();
						}, 1500);
					}
				},
				complete: data => {}
			});
		} else {
			const value = courseList[0].id;
			if (courseList) {
				this.getProductList(value);
				this.getCouponByUidAndTid(value);
				this.tId = value;
			}
		}*/
	},
	onShow() {
		this.addressData = uni.getStorageSync('addressItem');
		if (this.addressData) {
			uni.removeStorageSync('addressItem');
		}
	},
	methods: {
		/* 跳转到地址选择 */
		goAddressSel() {
			uni.navigateTo({
				url: '../user/info/addList/addList?type=1'
			});
		},
		textareaBInput(e) {
			this.textareaBValue = e.detail.value;
		},
		DateChange(e) {
			this.date = e.detail.value;
		},
		TimeChange(e) {
			this.time = e.detail.value;
		},
		getDate() {
			let date = new Date();
			if (this.isAddDate) {
				date = date.setDate(date.getDate() + 1);
				date = new Date(date);
			}
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month >= 1 && month <= 9 ? (month = '0' + month) : '';
			day >= 0 && day <= 9 ? (day = '0' + day) : '';
			return year + '-' + month + '-' + day;
		},
		getTime() {
			let date = new Date();
			let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
			let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			return hour + ':' + minute;
		},
		getHours() {
			let date = new Date();
			let hour = date.getHours();
			return hour;
		},
		getMinutes() {
			let date = new Date();
			let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			if (this.getHours() < 9 || this.getHours() > 18) {
				minute = '00';
			}
			return minute;
		},
		/* 获取预约信息 */
		getProductList(courseId) {
			if (courseId != null) {
				this.$req.request({
					url: 'api/commom/getProductList',
					method: 'get',
					data: {
						pageNo: this.pageNo,
						pageSize: this.pageSize,
						courseId: courseId,
						name: ''
					},
					success: res => {
						if (res.data.code == 200) {
							this.digest = res.data.data.items[0].digest;
							this.price = res.data.data.items[0].preferentialPrice;
							this.courseId = res.data.data.items[0].id;
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						}
					},
					complete: data => {
						uni.hideLoading();
					}
				});
			} else {
				uni.showToast({
					title: '出现意外错误错误',
					icon: 'none'
				});
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
				}, 1500);
			}
		},
		/* 获取优惠券信息 */
		getCouponByUidAndTid(courseId) {
			this.$req.request({
				url: 'api/coupon/getCouponByUidAndTid/' + courseId,
				method: 'GET',
				success: res => {
					if (res.data.data.length > 0) {
						this.couponName = res.data.data.length + ' 张可用';
					} else {
						this.couponName = '暂无可用';
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		goCoupon() {
			uni.navigateTo({
				url: '../user/coupons/coupons?tId=' + this.tId
			});
		},
		/* 提交 */
		booking() {
			/* 验证地址 */
			if (!this.addressData) {
				uni.showToast({
					title: '请选择地址',
					icon: 'none'
				});
				setTimeout(function() {}, 1500);
				return false;
			}
			let dateTime = SOtime.time4(this.date + ' ' + this.time); //选择时间
			let dateTime_new = SOtime.time4(this.getDate() + ' ' + this.getTime()); //系统时间
			if (dateTime < dateTime_new) {
				uni.showToast({
					title: '选择时间不能小于当前时间',
					icon: 'none'
				});
				setTimeout(function() {}, 1500);
				return false;
			}
			this.$req.request({
				url: 'api/order/submitOrder',
				method: 'GET',
				data: {
					productId: this.courseId,
					addressId: this.addressData.id,
					gmtConfirm: SOtime.time4(this.date + ' ' + this.time),
					remark: this.textareaBValue,
					couponId: this.coupon != null ? this.coupon.couponId : null
					/*actualPrice: 0,
					carId: 0,
					communityFeeId: 0,
					couponId: 0,
					gmtConfirm: 0,
					orderTag: '',
					parkId: 0,
					price: 0,
					productId: 0,
					productName: '',
					remark: '',
					type: 0*/
				},
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				success: res => {
					if (res.data.code == 200) {
						uni.showModal({
							title: '提示',
							content: '预约成功',
							showCancel: true,
							cancelText: '取消',
							confirmText: '立即支付',
							success: data => {
								this.addressData = null;
								this.coupon = null;
								this.textareaBValue = '';
								if (data.confirm) {
									/* 跳转到支付页面 (带上订单编号)*/
									uni.navigateTo({
										url: '../pay/pay?orderNo=' + res.data.data.orderNo + '&actualPrice=' + res.data.data.actualPrice / 100 + '&type=1'
									});
								} else {
									//点击取消 跳转到订单页面 状态为未支付
									uni.redirectTo({
										url: '../user/myServices?status=1'
									});
								}
							}
						});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
.btn {
	width: 100%;
	position: fixed;
	bottom: 0px;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	height: 85rpx;
	line-height: 85rpx;
	font-size: 32rpx;
	text-align: center;
	border-radius: 35rpx 35rpx 0 0;
}

.car-item {
	justify-content: space-between;
	width: 100%;
}

.car-item view:nth-of-type(2) {
	color: red;
}

.textarea {
	margin: 0 auto;
	width: 100%;
	padding: 20rpx;
	background-color: #ffffff;
}
</style>
