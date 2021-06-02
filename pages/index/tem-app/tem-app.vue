<!-- 车辆出场 (包括无牌车出场)-->
<template>
	<view class="centre">
		<view class="entranceInfo">
			<view class="cu-form-group">
				<text style="width: 33%;" class="margin-left">你的车牌号为：</text>
				<input style="width: 33%;" class="text-right" type="text" @confirm="getParkFee" @blur="getParkFee" placeholder="请输入车牌" v-model="carCode" />
			</view>
		</view>
		<view class="btn1" @click="config">确认进场</view>
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
		}
	},
	methods: {
		/* 车辆出场 */
		config() {
			if (this.carCode) {
				this.$req.request({
					url: 'api/homeMqtt/recordInNocarnum',
					header: {
						ACCESSTOKEN: this.token,
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: {
						channelid: this.channelSeq,
						parkCode: this.parkCode,
						plateNumber: this.carCode
					},
					success: res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '进场成功',
								icon: 'success'
							});
						}
					},
					complete: data => {
						uni.hideLoading();
					}
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
