<!-- 车辆出场 (包括无牌车出场)-->
<template>
	<view class="centre">
		<!-- <view class="central">
			<view class="nav1"><plate @listenPlateChange="plateChange" :defaultPlate="plateNumber" v-if="flag" /></view>
		</view> -->

		<view class="entranceInfo">
			<view class="cu-form-group">
				<text style="width: 33%;" class="margin-left">你的车牌号为：</text>
				<view
					style="margin-left: 17%;text-align: right;"
					@click="noCarCode = !noCarCode"
					:class="noCarCode ? 'bg-blue text-white' : 'line-blue text-blue'"
					class="padding-xs radius solid"
				>
					无牌车
				</view>
				<input style="width: 33%;" class="text-right" type="text" @confirm="getParkFee" @blur="getParkFee" placeholder="请输入车牌" v-model="carCode" />
			</view>
			<view class="cu-form-group">
				<text class="margin-left">停车场信息：</text>
				<text class="margin-right text-color">{{ parkName }}</text>
			</view>
			<view class="cu-form-group">
				<text class="margin-left">驶入时间：</text>
				<text class="margin-right text-color">{{ enterDate }}</text>
			</view>
			<view class="cu-form-group">
				<text class="margin-left">停车时长：</text>
				<text class="margin-right text-color">{{ parkingTime }}分钟</text>
			</view>
			<view class="cu-form-group">
				<text class="margin-left">停车费用：</text>
				<text class="margin-right text-yellow">￥{{ price }}元</text>
			</view>
		</view>
		<view class="" style="margin-top: 100rpx;margin-left: 70rpx;">
			<text class="text-black">提示：{{ errMsg }}</text>
		</view>
		<view class="btn1" @click="config">确认出场</view>
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
			carCode: '',
			plateNumber: [],
			parkName: '',
			price: 0,
			parkCode: '',
			channelSeq: '',
			flag: false,
			enterDate: '',
			parkingTime: '0',
			orderNo: '',
			actualPrice: '',
			carCode: '',
			car: '',
			carList: Object,
			isHaveOrNot: false,
			/*, 是否是无牌车*/
			bool: false, //为无牌车时是否有当前输入的车牌进场记录
			index: -1,
			isUser: false,
			parkingCode: '',
			order: null,
			errMsg: '',
			noCarCode: false
		};
	},
	props: {
		message: ''
	},
	onLoad(options) {
		if (options.parkCode) {
			uni.setStorageSync('parkCode', options.parkCode);
			uni.setStorageSync('channelSeq', options.channelSeq);
		}
	},
	onShow() {
		if (!uni.getStorageSync('userList')) {
			uni.navigateTo({
				url: '../../register/wxlogin'
			});
			return;
		}
		this.token = uni.getStorageSync('userList').accessToken;
		this.parkCode = uni.getStorageSync('parkCode');
		if (this.parkCode != '') {
			this.channelSeq = uni.getStorageSync('channelSeq');
			/*let plateNumber = uni.getStorageSync('plateNumber');
			if (plateNumber != '') {
				this.getCarInfoByCarNo(plateNumber);
			} else {
				this.scanChannelCodeInOut();
			}*/
			this.scanChannelCodeInOut2();
		}
	},
	watch: {
		noCarCode(val) {
			if (val) {
				this.getParkFee();
			}
		}
	},
	methods: {
		scanChannelCodeInOut2() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/homeMqtt/scanChannelCodeInOut',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					parkCode: this.parkCode,
					channelSeq: this.channelSeq
				},
				success: res => {
					this.errMsg = res.data.message;
					if (res.data.message.indexOf('成功') > -1) {
						this.carCode = res.data.data.carCode;
						this.channelSeq = res.data.data.channelSeq;
						this.parkingCode = res.data.data.parkingCode;
						this.parkCode = res.data.data.parkCode;
						this.getParkFee();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.message
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 根据选择的车牌查看停车信息 */
		getCarInfoByCarNo(plateNumber) {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/homeMqtt/scanChannelCodeInOut',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					parkCode: this.parkCode,
					channelSeq: this.channelSeq
				},
				success: res => {
					this.flag = true;
					if (res.data.data.code == 0) {
						if (res.data.data.hasOwnProperty('parkingCode')) {
							for (let item of plateNumber) {
								this.plateNumber.push(item);
							}
							this.car = plateNumber;
							this.parkingCode = res.data.data.parkingCode;
							this.getParkFee();
							this.bool = true;
						} else {
							this.isHaveOrNot = true;
							this.bool = false;
							this.parkName = '';
							this.price = 0;
							this.enterDate = '';
							this.parkingTime = 0;
							uni.showToast({
								title: '车牌输入错误',
								icon: 'none'
							});
						}
					} else {
						uni.showToast({
							title: res.data.data.msg,
							icon: 'none'
						});
					}
					uni.removeStorageSync('plateNumber');
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 扫描通道二维码出场 */
		scanChannelCodeInOut() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/homeMqtt/scanChannelCodeInOut',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					parkCode: this.parkCode,
					channelSeq: this.channelSeq
				},
				success: res => {
					if (res.data.data.code == 8) {
						uni.showToast({
							title: res.data.data.msg,
							icon: 'none'
						});
						this.flag = true;
					} else {
						if (res.data.data.hasOwnProperty('parkingCode')) {
							//有牌车
							this.flag = true;
							this.isHaveOrNot = false;
							this.isUser = false; //是否是进场用户出场
							if (res.data.data.code == 3) {
								this.plateNumber = [];
								this.car = res.data.data.carCode;
								this.parkingCode = res.data.data.parkingCode;
								for (let item of res.data.data.carCode) {
									this.plateNumber.push(item);
								}
							} else {
								uni.showToast({
									title: res.data.data.msg,
									icon: 'none'
								});
							}
						} else {
							//无牌车
							this.isHaveOrNot = true;
							this.$req.request({
								url: 'api/park/findUserParkCarList',
								method: 'get',
								data: {
									parkCode: this.parkCode,
									status: 1
								},
								success: data => {
									this.flag = true;
									if (data.data.data.length > 0) {
										//有记录  说明是用户进场  显示进场的车牌号(显示的为第一个)
										this.isUser = true; //是否是进场用户出场
										this.car = data.data.data[0];
										this.carList = data.data.data; //用户进场记录列表
										this.plateNumber = [];
										for (let item of this.car.carLicenseNumber) {
											this.plateNumber.push(item);
										}
									} else {
										//不是用户进场
										uni.showToast({
											title: '请输入你要出场的车牌号',
											icon: 'none'
										});
									}
								},
								complete: data => {}
							});
						}
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 获取停车信息 */
		getParkFee() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/homeMqtt/getParkFee',
				header: {
					ACCESSTOKEN: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					//outChannelid: this.channelSeq,
					parkCode: this.parkCode,
					carCode: (this.noCarCode ? '无' : '') + this.carCode
				},
				success: res => {
					if (res.data.code == 200) {
						this.errMsg = res.data.msg;
						this.parkName = res.data.data.parkName;
						this.parkingTime = res.data.data.parkingTime;
						let enterDate_new = res.data.data.enterDate;
						this.enterDate = '';
						this.enterDate = this.enterDate + enterDate_new.substring(0, 4) + '-';
						this.enterDate = this.enterDate + enterDate_new.substring(4, 6) + '-';
						this.enterDate = this.enterDate + enterDate_new.substring(6, 8) + ' ';
						this.enterDate = this.enterDate + enterDate_new.substring(8, 10) + ':';
						this.enterDate = this.enterDate + enterDate_new.substring(10, 12) + ':';
						this.enterDate = this.enterDate + enterDate_new.substring(12, 14);
						this.price = res.data.data.shouldPayValue;
						this.orderNo = res.data.data.orderNo;
						this.actualPrice = res.data.data.actualPrice;
						this.order = {
							parkName: res.data.data.parkName,
							parkingTime: res.data.data.parkingTime,
							enterDate: this.enterDate,
							price: res.data.data.shouldPayValue,
							orderNo: res.data.data.orderNo,
							actualPrice: res.data.data.actualPrice
						};
					} else {
						this.errMsg = res.data.msg;
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
		plateChange(val) {
			this.plateNumber = val;
			if (this.plateNumber.length >= 7) {
				let car = ''; //当前显示的车牌号
				for (let i = 0; i < this.plateNumber.length; i++) {
					car = car + this.plateNumber[i];
				}
				if (this.isHaveOrNot) {
					//是无牌车
					this.$req.request({
						url: 'api/homeMqtt/scanChannelCodeInOut',
						header: {
							ACCESSTOKEN: this.token,
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: {
							parkCode: this.parkCode,
							channelSeq: this.channelSeq,
							type: 2
						},
						success: res => {
							if (res.data.data.hasOwnProperty('parkingCode')) {
								this.parkingCode = res.data.data.parkingCode;
								this.getParkFee();
								this.bool = true;
							} else {
								this.bool = false;
								this.parkName = '';
								this.plateNumber = [];
								this.price = 0;
								this.enterDate = '';
								this.parkingTime = 0;
								uni.showToast({
									title: res.data.data.msg,
									icon: 'none'
								});
							}
						},
						complete: data => {}
					});
				} else {
					console.log('2');
					if (car != this.car) {
						this.bool = false;
						this.parkName = '';
						this.price = 0;
						this.enterDate = '';
						this.parkingTime = 0;
						uni.showToast({
							title: '选择的车牌与当前通道车牌不一致',
							icon: 'none'
						});
					} else {
						this.getParkFee();
						this.bool = true;
					}
				}
			}
		},
		goMyVehicles() {
			uni.navigateTo({
				url: '../../user/info/vehicleBinding/cardList?type=1'
			});
		},
		/* 车辆出场 */
		config() {
			if (!this.order) {
				uni.showToast({
					title: '没有找到收费信息',
					icon: 'none'
				});
			} else {
				uni.redirectTo({
					url: '../../pay/pay?orderNo=' + this.orderNo + '&actualPrice=' + this.actualPrice / 100
				});
			}
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

.item-plate {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}

.item-license-plate {
	width: 30%;
	text-align: center;
	color: #007aff;
}
.btn1 {
	text-align: center;
	position: fixed;
	bottom: 0px;
	width: 100%;
	height: 85rpx;
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	line-height: 85rpx;
	font-size: 32rpx;
	border-radius: 35rpx 35rpx 0 0;
}
.solid-bottom {
	height: 4rem;
	border-bottom: 1px solid rgba(204, 204, 204, 0.2);
}
.text-color {
	color: rgb(59, 144, 7);
}
</style>
