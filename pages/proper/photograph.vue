<template>
	<view class="photograph">
		<view class="container">
			<map v-if="showMap" class="box" id="myMap" :markers="marker" :longitude="longitude" :latitude="latitude" scale="16" show-location></map>
			<view v-else class="box"><van-empty description="请刷新定位"></van-empty></view>
			<view class="btn">
				<button @click="getLocation2" type="default">刷新定位</button>
				<button @click="showPopup" type="default">添加备注</button>
			</view>
			<view @click="submit" class="submit">拍照并提交</view>
		</view>
		<van-popup :show="show" round position="bottom" custom-style="height: 40%;padding:20rpx" @close="onClose">
			<textarea v-model="remark" maxlength="-1" placeholder="请点击此处输入备注..." style="width: 100%;height: 100%;font-size: 32rpx;" />
		</van-popup>
	</view>
</template>

<script>
var log = require('@/util/log.js');
// #ifdef MP-WEIXIN
import QQMapWX from '@/js_sdk/qqmap/qqmap-wx-jssdk.js';
import vanPopup from '@/wxcomponents/vant/popup/index';
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import QQMapWX from '@/js_sdk/qqmap/qqmap-wx-jssdk.js';
import vanPopup from '@/components/vant/popup/index';
import vanEmpty from '@/components/vant/empty/index';
// #endif
import { getLocation } from '@/util/tool.js';
export default {
	components: {
		vanPopup,
		vanEmpty
	},
	data() {
		return {
			user: null,
			qqmapsdk: null,
			latitude: '',
			longitude: '',
			marker: [],
			show: false,
			remark: '',
			qrId: null,
			communityId: null,
			showMap: false
		};
	},
	async onShow() {
		this.user = uni.getStorageSync('userList');
		if (!this.user || !this.user.phone) {
			uni.showToast({
				title: '请先登录或授权手机号',
				duration: 2000,
				icon: 'none'
			});
			this.tologin();
			return;
		}
		let result = await this.getCommunityId();
		if (!result.data.data) {
			uni.showLoading({
				title: '二维码无效',
				mask: true
			});
			return;
		}
		this.communityId = result.data.data.communityId;
		const ret = await this.isPersonnel();
		if (!ret.data.data == 1) {
			uni.showLoading({
				title: '非小区工作人员',
				mask: true
			});
			return;
		}
		let key = await this.getKey(1);
		this.qqmapsdk = new QQMapWX({
			key
		});
		this.getLocation2();
	},
	onLoad(option) {
		const scene = decodeURIComponent(option.scene);
		this.qrId = scene;
		this.$log.info(scene);
	},
	methods: {
		getCommunityId() {
			const _this = this;
			return new Promise((resolve, reject) => {
				_this.$req.request({
					url: 'api/form/getRemarks',
					method: 'get',
					data: {
						id: this.qrId
					},
					success: res => {
						resolve(res);
					},
					complete: data => {}
				});
			});
		},
		submit() {
			uni.navigateTo({
				url: 'camera/camera?qrId=' + this.qrId + '&remark=' + this.remark
			});
		},
		onClose() {
			this.show = false;
		},
		showPopup() {
			this.show = true;
		},
		/* 获取地图key */
		getKey(id) {
			return new Promise((resolve, reject) => {
				this.$req.request({
					url: 'api/map/getMapKey/' + id,
					method: 'GET',
					success: res => {
						if (res.data.code == 200) {
							uni.setStorageSync('mapKey', res.data.data);
							resolve(res.data.data);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {}
				});
			});
		},
		/* 定位当前位置 */
		async getLocation2() {
			let driver = uni.getSystemInfoSync();
			let locationEnabled = driver.locationEnabled;
			console.log(driver.locationEnabled);
			await getLocation();
			if (uni.getStorageSync('lot')) {
				this.showMap = true;
				this.latitude = uni.getStorageSync('lat');
				this.longitude = uni.getStorageSync('lot');
				this.qqmapsdk.reverseGeocoder({
					success: res => {
						this.marker.push({
							title: res.result.address,
							id: 0,
							latitude: res.result.location.lat,
							longitude: res.result.location.lng,
							iconPath: this.user.avatarUrl,
							width: 20,
							height: 20,
							callout: {
								content: res.result.address,
								color: '#000',
								display: 'ALWAYS'
							}
						});
					}
				});
			}
		},

		isPersonnel() {
			const _this = this;
			return new Promise((resolve, reject) => {
				_this.$req.request({
					url: 'api/form/judgeIsPhone',
					method: 'get',
					data: {
						phone: _this.user.phone,
						communityId: _this.communityId
					},
					success: res => {
						resolve(res);
					},
					complete: data => {}
				});
			});
		},
		tologin() {
			uni.navigateTo({
				url: '../register/wxlogin'
			});
		}
	}
};
</script>

<style>
.photograph {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #f4f3f7;
}
.container {
	margin: 20rpx;
	margin-top: 0;
	height: 95%;
	width: 100%;
	box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.3);
}
.box {
	height: 450rpx;
	width: 100%;
}
.btn {
	display: flex;
}
.btn button {
	flex: 1;
	border-radius: 0rpx;
	width: 100%;
	margin: 0;
}
.submit {
	background-color: #282c35;
	border-radius: 50%;
	width: 250rpx;
	border: 0;
	height: 250rpx;
	margin: 0 auto;
	line-height: 250rpx;
	color: white;
	margin-top: 25%;
	text-align: center;
	box-shadow: 0 0 2rpx 2rpx rgba(0, 0, 0, 0.3);
}
</style>
