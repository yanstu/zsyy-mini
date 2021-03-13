<!-- 无牌进场 -->
<template>
	<view class="centre">
		<view class="cu-bar bg-white">
			<text class="text-black margin-left">请输入有效的车牌：</text>
			<view class="margin-right text-blue" style="text-decoration: underline;" @click="goMyVehicles">
				我的车牌
				<text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="central">
			<view class="nav1"><plate @listenPlateChange="plateChange" :defaultPlate="plateNumber" v-if="flag" /></view>
		</view>
		<view class="entranceInfo">
			<view class="cu-bar bg-white solid-bottom">
				<text class="margin-left">停车场信息：</text>
				<text class="margin-right text-blue">{{ parkName ? parkName : '' }}</text>
			</view>

			<view class="cu-bar bg-white solid-bottom">
				<text class="margin-left">停车费用：</text>
				<text class="margin-right" style="color: #e50003;">￥{{ price }}元/小时</text>
			</view>
		</view>
		<view class="btn1" @click="sunmit">确认进场</view>
	</view>
</template>

<script>
import plate from '../../../components/plate/index';
export default {
	components: {
		plate
	},
	data() {
		return {
			code: '',
			checked: true,
			plateNumber: [],
			parkName: '',
			price: 0,
			parkCode: '',
			channelSeq: '',
			token: '',
			flag: false
		};
	},
	onLoad(options) {
		if (options.parkCode) {
			uni.setStorageSync('parkCode', options.parkCode);
			uni.setStorageSync('channelSeq', options.channelSeq);
		}
	},
	onShow() {
		var res = this.checkLogin();
		if (!res) {
			return false;
		}
		this.token = res;
		this.parkCode = uni.getStorageSync('parkCode');
		if (this.parkCode != '') {
			this.channelSeq = uni.getStorageSync('channelSeq');
			let plateNumber = uni.getStorageSync('plateNumber');
			this.plateNumber = [];
			if (plateNumber != '') {
				for (let item of plateNumber) {
					console.log(this.plateNumber);
					this.plateNumber.push(item);
				}
				//uni.removeStorageSync('plateNumber');
			}
			this.getParkByCode();
			this.flag = true;
		}
	},
	props: {
		message: ''
	},
	methods: {
		getParkByCode() {
			this.$req.request({
				url: 'api/park/getParkCarDetail',
				method: 'get',
				data: {
					parkCode: this.parkCode
				},
				success: res => {
					if (res.data.code == 200) {
						console.log('parkName');
						console.log(res);
						if (res.data.data) {
							this.parkName = res.data.data.parkName;
							this.price = res.data.data.toll;
						} else {
							uni.showToast({
								title: '抱歉,没有找到该停车场的信息',
								icon: 'none'
							});
						}
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		},
		sunmit() {
			// var card_reg =/^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/;
			var card_reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
			let catNum = '';
			for (let i = 0; i < this.plateNumber.length; i++) {
				catNum = catNum + this.plateNumber[i];
			}
			if (!card_reg.test(catNum)) {
				uni.showToast({
					title: '请输入有效的车牌号',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/zhtc/tozhtc/v2/scanChannelCodeInOut',
				header: {
					accessToken: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					parkCode: this.parkCode,
					channelSeq: this.channelSeq,
					carLicenseNumber: catNum,
					type: 1
				},
				success: res => {
					if (res.data.data.code == 0) {
						uni.showToast({
							title: '进场成功',
							icon: 'none'
						});
						uni.switchTab({
							url: '../index'
						});
					} else {
						uni.showToast({
							title: res.data.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		plateChange(val) {
			this.plateNumber = val;
		},
		goMyVehicles() {
			uni.navigateTo({
				url: '../../user/info/vehicleBinding/cardList?type=1'
			});
		}
	}
};
</script>

<style>
.centre {
	height: 100%;
	background-color: #ffffff;
}

.central {
	width: 100%;
	height: 200rpx;
}

.nav1 {
	height: 100%;
	width: 100%;
	border-top: 1px solid rgba(204, 204, 204, 0.2);
	border-bottom: 1px solid rgba(204, 204, 204, 0.2);
}

.btn1 {
	border-radius: 35rpx 35rpx 0 0;
	text-align: center;
	position: fixed;
	bottom: 0px;
	width: 100%;
	height: 85rpx;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	line-height: 85rpx;
	font-size: 32rpx;
}

.solid-bottom {
	border-bottom: 1px solid rgba(204, 204, 204, 0.2);
}
</style>
