<!-- 小区空余车辆显示 -->
<template>
	<view>
		<view id="box" class="box" :style="{ height: mapHeight - 100 + 'px' }">
			<map
				id="box-map"
				:latitude="latitude"
				:longitude="longitude"
				:markers="covers"
				show-location
				:include-points="covers"
				enable-traffic
				:style="{ height: mapHeight - 100 + 'px' }"
			></map>
		</view>
		<view id="park" class="park" :style="{ height: parkHeight + 110 + 'px' }">
			<view class="park-header" :class="none">
				<view class="park-info">
					<view class="park-body">
						<view class="park-title">{{ parkInfo.title }}</view>
						<view style="display: flex; padding: 0; margin: 0;">
							<view class="park-body-dizhi">
								剩余车位:
								<text>{{ parkInfo.eptCarports }}个</text>
								<text style="color: #000000;">{{ parkInfo.address }}</text>
							</view>
							<view class="park-body-dizhi-img"><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/地图.png" mode="aspectFill"></image></view>
						</view>
					</view>
				</view>
			</view>
			<view class="park-route" :class="none">
				<view class="park-title">推荐方案</view>
				<view style="white-space: nowrap;overflow-x: scroll;overflow-y: hidden; ">
					<view
						class="park-route-item"
						:class="{ 'park-route-item_active': id == index, 'solid-right': index == 0, 'solid-right_new': index == 1 }"
						v-for="(item, index) in routes"
						:key="index"
						@click="change(index)"
					>
						<view class="park-route-item-title" :class="id == index ? 'park-route-item-title_active' : ''">{{ item.title }}</view>
						<view>{{ recent[index].title }}</view>
						<view class="park-route-item-distance">据您 {{ item.distance }}</view>
						<view class="park-route-item-time">预计耗时{{ item.time }}</view>
					</view>
				</view>
			</view>
			<view class="park-btn">
				<view class="park-btn-img" @click="pageReturn">
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/shouye_06.png" mode="aspectFill"></image>
					周边
				</view>
				<view class="park-btn-img" @click="toggel(none)">
					<image
						:src="none == 'hide' ? 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/眼睛睁.png' : 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/隐藏.png'"
						mode="aspectFill"
					></image>
					隐藏
				</view>

				<button class="park-btn-img" open-type="share">
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/分享.png" mode="aspectFill"></image>
					<view>分享</view>
				</button>
				<view class="park-navigation" @click="goMap">开始导航</view>
			</view>
		</view>
	</view>
</template>

<script>
import QQMapWX from '@/js_sdk/qqmap/qqmap-wx-jssdk.js';
export default {
	onShareAppMessage() {
		return {
			title: '我正在前往' + this.parkInfo.title
			//desc: '分享页面的内容',
			// path: 'pages/index/spareVehicles?type=1&openParam=' + this.openParam + '&item=' + uni.getStorageSync('item')
		};
	},
	data() {
		return {
			latitude: 22.63137, //纬度
			longitude: 114.010857, //经度
			covers: [], //标记点
			mapHeight: 0,
			parkHeight: 0,
			routes: [],
			id: 0,
			parkInfo: [],
			qqmapsdk: null,
			recent: [],
			parkData: [],
			none: 'hide'
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中'
		});
		this.parkInfo = uni.getStorageSync('parkingInfo');
		this.recent.push(this.parkInfo);
		let recent_new = uni.getStorageSync('covers_no');
		for (let item of recent_new) {
			this.recent.push(item);
		}
		this.recent = this.recent.filter((item, index) => index < 3);
		this.parkData = this.recent;
		this.covers.push(this.recent[this.id]);
		this.latitude = uni.getStorageSync('lat');
		this.longitude = uni.getStorageSync('lot');
		this.qqmapsdk = new QQMapWX({
			key: uni.getStorageSync('mapKey')
		});
		this.calculateDistance();
	},
	onReady() {
		uni.hideLoading();
	},
	mounted() {
		uni.getSystemInfo({
			success: res => {
				this.mapHeight = res.windowHeight * 0.6;
				this.parkHeight = res.windowHeight * 0.4;
			}
		});
	},
	methods: {
		/* 距离及耗时 */
		calculateDistance() {
			let coordinates = [];
			for (let item of this.recent) {
				coordinates.push({
					latitude: item.latitude,
					longitude: item.longitude
				});
			}
			this.qqmapsdk.calculateDistance({
				mode: 'driving',
				to: coordinates,
				success: res => {
					if (res.status == 0) {
						this.routes = [];
						for (let i = 0; i < res.result.elements.length; i++) {
							this.routes.push({
								title: '方案' + (i + 1),
								time: this.SecondToDate(res.result.elements[i].duration),
								distance: this.getDistance(res.result.elements[i].distance)
							});
						}
					}
				},
				fail: data => {}
			});
		},
		getDistance(distance) {
			var dis = [];
			dis.push(distance); //将返回数据存入dis数组，
			let disKM = Number(dis.toString());
			disKM = Math.round((disKM / 1000) * 10000) / 10000;
			disKM = disKM.toFixed(1) + '公里'; //保留两位小数
			return disKM;
		},
		SecondToDate(msd) {
			var time = msd;
			if (null != time && '' != time) {
				if (time > 60 && time < 60 * 60) {
					time = parseInt(time / 60.0) + '分钟' + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + '秒';
				} else if (time >= 60 * 60 && time < 60 * 60 * 24) {
					time =
						parseInt(time / 3600.0) +
						'小时' +
						parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
						'分钟' +
						parseInt(
							(parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60
						) +
						'秒';
				} else if (time >= 60 * 60 * 24) {
					time =
						parseInt(time / 3600.0 / 24) +
						'天' +
						parseInt((parseFloat(time / 3600.0 / 24) - parseInt(time / 3600.0 / 24)) * 24) +
						'小时' +
						parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) +
						'分钟' +
						parseInt(
							(parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60
						) +
						'秒';
				} else {
					time = parseInt(time) + '秒';
				}
			}
			return time;
		},
		change(index) {
			this.id = index;
			this.covers = [];
			this.covers.push(this.recent[this.id]);
			this.parkInfo = this.covers[0];
		},
		goMap() {
			// console.log(this.parkInfo)
			uni.openLocation({
				latitude: parseFloat(this.parkInfo.latitude),
				longitude: parseFloat(this.parkInfo.longitude),
				scale: 16,
				name: this.parkInfo.callout.content,
				address: this.parkInfo.address,
				fail: err => {
					uni.showToast({
						title: '打开失败，请检查设置',
						icon: 'none'
					});
				}
			});
		},

		//返回上级页面
		pageReturn() {
			uni.switchTab({
				url: './index'
			});
		},

		share() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 1,
				summary: '我即将前往这里',
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log(err);
					console.log('fail:' + JSON.stringify(err));
					uni.showToast({
						title: '分享错误',
						icon: 'none'
					});
				}
			});
		},
		// 隐藏
		toggel(e) {
			if (e == 'show') {
				this.none = 'hide';
				this.mapHeight -= this.parkHeight + 100;
			} else {
				this.none = 'show';
				this.mapHeight += this.parkHeight + 100;
			}
		}
	}
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
	background: rgb(245, 245, 245);
	overflow: hidden;
}

button::after {
	border: none;
	background-color: none;
}

.box {
	width: 100%;
}

#box-map {
	width: 100%;
}

.park {
	width: 100%;
	background-color: rgb(245, 245, 245);
	border-top-left-radius: 30rpx;
	border-top-right-radius: 30rpx;
	overflow: hidden;
	height: 100%;
	z-index: 888;
}

.park-title {
	font-size: 40rpx;
	font-weight: bold;
	margin-left: 3%;
}

.park-header {
	background-color: rgb(254, 254, 254);
	height: 200rpx;
}

.park-route {
	width: 100%;
	border-bottom: 1px solid #ccc;
	background-color: rgb(254, 254, 254);
	margin-top: 2%;
	overflow-x: auto;
	height: 100%;
}

.park-route-item {
	height: 250rpx;
	width: 60%;
	color: #000000;
	margin: 25rpx 20rpx;
	display: inline-block;
	border-radius: 30rpx;
	box-shadow: 5rpx 5rpx 2rpx 5rpx rgba(192, 192, 192, 0.3);
}

.park-route-item view {
	margin-left: 10%;
	margin-top: 3%;
}

.park-route-item view:first-child {
	font-size: 40rpx;
	font-weight: bold;
	margin: 10rpx 0;
}

.solid-right {
	/* border-right: 1px solid #CCCCCC; */
}

.solid-right_new {
	/* border-right: 1px solid #CCCCCC; */
}

.park-route-item-title {
	color: rgb(149, 149, 149);
	text-align: center;
}

.park-route-item_active,
.park-route-item-title_active {
	color: rgb(10, 119, 222);
}

.park-route-item-time {
	font-size: 35rpx;
}

.park-info {
	width: 100%;
	height: 65%;
	display: flex;
}

.park-body {
	height: 100%;
}

.park-body view {
	height: 25%;
	margin: 20rpx 0;
	padding-left: 30rpx;
	color: #000000;
}

.park-body-dizhi {
	width: 80%;
	text-align: left;
}

.park-body-dizhi-img image {
	width: 75rpx;
	height: 60rpx;
}

.park-body text {
	color: rgb(254, 0, 0);
	margin-left: 20rpx;
}

.park-btn {
	width: 100%;
	height: 120rpx;
	position: absolute;
	bottom: 0;
	background-color: rgb(254, 254, 254);
}

.park-pay-img image {
	width: 40rpx;
	border-radius: 50%;
	height: 40rpx;
	margin-right: 20rpx;
}

.park-btn {
	display: flex;
	justify-content: center;
}

.park-btn button {
	margin: 0;
	padding: 0;
	border: 0;
	outline: none;
	background-color: transparent;
	padding-top: 25rpx;
	display: block;
}

.park-btn-img {
	width: 150rpx;
	height: 100%;
	text-align: center;
	padding-top: 25rpx;
}

.park-btn-img image {
	width: 50rpx;
	height: 50rpx;
	display: block;
	margin-left: 50rpx;
	/* margin-top: 10rpx; */
}

.park-btn-img view {
	position: absolute;
	font-size: 30rpx;
	line-height: 43rpx;
	left: 0;
	right: 0;
	margin: auto;
}

.park-navigation {
	background-color: rgb(50, 118, 253);
	color: #ffffff;
	width: 30%;
	margin: auto;
	text-align: center;
	padding-top: 12rpx;
	padding-bottom: 12rpx;
	border-radius: 30rpx;
}

/* 显示隐藏动画 */
.show {
	animation: showLayer 0.2s linear both;
	display: none;
}

.hide {
	animation: hideLayer 0.2s linear both;
}

@keyframes showLayer {
	0% {
		transform: translateY(0%);
	}

	100% {
		transform: translateY(65%); //这里可以通过变大变小调整偏移量
	}
}

@keyframes hideLayer {
	0% {
		transform: translateY(65%);
	}

	100% {
		transform: translateY(0);
	}
}

.amap-logo {
	right: 0 !important;
	left: auto !important;
	display: none !important;
}

.amap-copyright {
	right: 70px !important;
	left: auto !important;
	opacity: 0 !important;
}
.amap-scalecontrol {
	display: none !important;
}
</style>
