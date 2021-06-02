<template>
	<view class="centre">
		<!-- <view class="cu-bar bg-white">
			<view class="action text-black" style="font-size: 33rpx;">选择或输入车牌</view>
			<view class="action"><button v-if="carList.length != 0" class="cu-btn bg-blue shadow margin-left" @tap="showModal" data-target="DrawerModalR">车牌列表</button></view>
		</view> -->
		<!-- <view class="cu-modal drawer-modal justify-end" :class="modalName == 'DrawerModalR' ? 'show' : ''" @tap="hideModal">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{ top: CustomBar + 'px', height: 'calc(100vh - ' + CustomBar + 'px)' }]">
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item, index) in carList" :key="index">
						<view class="content" @click="carmode(item)">
							<view>
								{{ item.carLicenseNumber }}
								<text class="margin-left">{{ item.selfInRandomCode == '' ? '有牌车' : '无牌车' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<!-- <view class="central solid-top" style="margin: auto;"><plate @listenPlateChange="plateChange" :defaultPlate="plateNumber" /></view> -->
		<view class="entranceInfo">
			<!-- <view v-if="isOnlod" class="cu-bar bg-white solid-bottom solid-top">
				<text class=" margin-left text-black">车牌号：<text class="text-color">{{carp || ''}}</text></text>
			</view> -->
			<view class="cu-form-group">
				<text class="margin-left">你的车牌号为：</text>
				<view><input class="text-right" type="text" @confirm="querycrad" @blur="querycrad" placeholder="请输入车牌" v-model="carCode" /></view>
			</view>
			<view class="cu-form-group">
				<text class=" margin-left text-black">停车场信息：</text>
				<text class="margin-right text-color">{{ parkName || '' }}</text>
			</view>
			<view class="cu-form-group">
				<text class="margin-left text-black">驶入时间：</text>
				<text class="margin-right text-color">{{ enterDate || '' }}</text>
			</view>
			<view class="cu-form-group">
				<text class=" margin-left text-black">停车时长：</text>
				<text class="margin-right text-color">{{ parkingTime || '' }}分钟</text>
			</view>
			<view class="cu-form-group">
				<text class="margin-left">停车费用：</text>
				<text class="margin-right text-yellow">￥{{ price || 0 }}元</text>
			</view>
			<!-- <view class="cu-form-group">
				<text class="margin-left">注意：<text class="text-red">(无牌车不能预约离场)</text></text>
			</view> -->
		</view>
		<view class="" style="margin-top: 100rpx;margin-left: 70rpx;">
			<text class="text-black">{{ errMsg }}</text>
		</view>
		<view class="btn1">
			<view><text class="text-black">提示：请在15分钟内离开停车场,否则将会继续扣费</text></view>
		</view>
		<view class="foot-btn" @click="sunmitMaster">确定缴费</view>
	</view>
</template>

<script>
import plate from '@/components/plate/index.vue';
export default {
	name: 'index',
	components: {
		plate
	},
	data() {
		return {
			CustomBar: this.CustomBar,
			modalName: null,
			plateNumber: [],
			parkingCode: '',
			price: 0,
			parkName: '',
			enterDate: '',
			parkingTime: '0',
			orderNo: '',
			actualPrice: '',
			isShow: false,
			isOnlod: false,
			carList: [],
			carp: '',
			parkCode: '',
			carCode: '',
			errMsg: ''
		};
	},
	props: {
		message: ''
	},
	onReady() {},
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
		} else {
			this.cardList();
		}
	},
	methods: {
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target;
		},
		hideModal(e) {
			this.modalName = null;
		},
		carmode(item) {
			this.isOnlod = true;
			this.carp = '';
			this.parkName = '';
			this.parkingTime = '';
			this.enterDate = '';
			this.price = '';
			this.price = '';
			this.orderNo = '';
			this.$req.request({
				url: 'api/homeMqtt/getParkFee',
				header: {
					'Content-Type': 'application/json; charset=UTF-8',
					ACCESSTOKEN: this.token
				},
				data: {
					carCode: item.carLicenseNumber
				},
				success: res => {
					this.$log.info(res);
					if (res.data.code == 200) {
						// for (let arr of item.carCode) {
						// 	this.carp.push(arr)
						// }
						this.carp = res.data.data.carCode;
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

						uni.hideLoading();
					}
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.parkName = '';
						this.parkingTime = '';
						this.enterDate = '';
						this.price = '';
					} else {
						uni.hideLoading();
					}
				},
				complete: data => {
					this.modalName = null;
				}
			});
		},
		// 进场记录
		cardList() {
			this.$req.request({
				url: 'api/park/findUserParkCarList',
				method: 'get',
				data: {
					status: 1,
					parkCode: ''
				},
				success: res => {
					this.$log.info(res);
					this.parkCode = res.data[0].parkCode;
					this.carCode = res.data[0].carLicenseNumber;
				},
				complete: data => {}
			});
		},
		// 输入车牌号转码
		plateChange(val) {
			this.card = '';
			this.plateNumber = val;
			for (let i = 0; i < this.plateNumber.length; i++) {
				this.card = this.card + this.plateNumber[i];
			}
			if (this.card.length == 8) {
				this.querycrad();
			} else if (this.card.length == 7) {
				this.querycrad();
			}
		},

		// 查询停车信息
		querycrad() {
			this.carp = '';
			this.parkName = '';
			this.parkingTime = '';
			this.enterDate = '';
			this.price = '';
			this.orderNo = '';
			this.isOnlod = false;
			this.$req.request({
				url: 'api/homeMqtt/getParkFee',
				header: {
					'Content-Type': 'application/json; charset=UTF-8',
					ACCESSTOKEN: this.token
				},
				data: {
					carCode: this.carCode,
					parkCode: this.parkCode
				},
				success: res => {
					this.$log.info(res);
					if (res.data.code == 200) {
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

						uni.hideLoading();
					}
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						this.parkName = '';
						this.parkingTime = 0;
						this.enterDate = '';
						this.price = 0;
					} else {
						uni.hideLoading();
					}
					this.errMsg = res.data.msg;
				},
				complete: data => {}
			});
		},
		// 跳转支付
		sunmitMaster() {
			if (!this.order) {
				uni.showToast({
					title: '无需缴费',
					icon: 'none'
				});
				return;
			} else {
				uni.navigateTo({
					url: '../../pay/pay?actualPrice=' + this.actualPrice / 100 + '&orderNo=' + this.orderNo
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
.centre {
	height: 100%;
	background-color: #ffffff;
}
.central {
	width: 100%;
	height: 200rpx;
}
.item-plate {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}

.item-license-plate {
	width: 30%;
	text-decoration: underline;
	color: #007aff;
}

.nav1 {
	display: flex;
	flex-direction: row;
	padding-top: 20px;
	padding-bottom: 20px;
	border-top: 1px solid rgba(204, 204, 204, 0.3);
	border-bottom: 1px solid rgba(204, 204, 204, 0.3);
}

.phClass {
	position: absolute;
	outline: none;
	color: transparent;
	text-shadow: 0 0 0 transparent;
	background: #00000000;
	margin-top: -40px;
	height: 30px;
	width: 100%;
	/* border: 1px solid #fff706; */
}

.btn1 {
	position: fixed;
	bottom: 95rpx;
	width: 100%;
	text-align: center;
}
.foot-btn {
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	text-align: center;
	position: fixed;
	bottom: 0px;
	left: 0px;
	right: 0px;
	height: 85rpx;
	line-height: 85rpx;
	font-size: 32rpx;
	border-radius: 35rpx 35rpx 0 0;
}
.text-color {
	color: rgb(59, 144, 7);
}
.solid-bottom {
	border-bottom: 1rpx solid rgba(204, 204, 204, 0.3);
}
.solid-top {
	border-top: 1rpx solid rgba(204, 204, 204, 0.3);
}
</style>
