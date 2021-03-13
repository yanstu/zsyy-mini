<template>
	<view class="content" :style="{ height: windowHeight + 'px' }">
		<view class="box">
			<view class="box-map" id="box-map" :style="{ height: (boxHeight + 100) * 2 + 'rpx' }">
				<map
					id="map"
					class=" box-map-content"
					:latitude="latitude"
					:longitude="longitude"
					:markers="coversPlus.length > 0 ? coversPlus : covers"
					:include-points="coversPlus.length > 0 ? coversPlus : covers"
					show-location
					enable-traffic
					enable-overlooking
					@markertap="marker"
				></map>
			</view>

			<view class="box-menu" @touchstart="start" @touchend="end" :style="{ height: menuHeight + 500 + 'px' }" :class="change">
				<!-- 回到当前位置 -->
				<view
					@tap="moveToLocation"
					style="width: 40px;height: 40px;z-index: 999; position: absolute;top: -200rpx; right: 20rpx;display: flex;align-items: center;justify-content: center;background-color: #FFFFFF;border-radius: 50%;box-shadow: 0 0 4rpx 2rpx rgba(83,83,83,.3);"
				>
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/我的定位.png" mode="aspectFill" style="width: 30px;height: 30px;margin-top: -5rpx;"></image>
				</view>

				<view style="width: 100%; height: 21px; position: absolute; top: -1px; margin: 3px 0; " @click.stop="toggle(change)"></view>
				<view class="box-menu-line" id="box-menu-line"></view>
				<view class="box-menu-search" id="box-menu-search">
					<view class="box-menu-search-icon"></view>
					<input class="box-menu-search-input" type="text" placeholder="搜索附近共享停车场" v-model="text" confirm-type="search" @confirm.stop="toSearch" />
					<view class="box-menu-search-scan" @tap.stop="scanCode"></view>
				</view>
				<view v-if="!showParkList" class="box-menu-content" @click="getLocation2"><van-empty>请先授权或开启定位服务，然后点击图标刷新</van-empty></view>
				<view v-else class="box-menu-content" @touchstart="" @touchend="" :style="{ height: (contentHeight + 500) * 2 + 'rpx' }">
					<view v-for="(item, index) in covers" :key="index" class="box-menu-content-item" @click.stop="marker(item)">
						<view class="top">
							<view class="top-left">
								<text class="title">{{ item.title }}</text>
								<view class="top-left-item">
									<text style="color: #0081FF;" class="cuIcon-locationfill"></text>
									地址：
									<text>{{ item.address }}</text>
								</view>
								<view class="top-left-item">
									<text style="color: #F28A4D;" class="cuIcon-rechargefill"></text>
									价格：
									<text style="color: #F28A4D;">{{ item.money / 100 }}</text>
									<text>元/小时</text>
								</view>
								<view class="top-left-item">
									<text class="cuIcon-forwardfill"></text>
									距您：
									<text style="margin-right: 30rpx;">{{ item.dist }}米</text>
									<text style="margin-right: 10rpx;color: red" class="cuIcon-taxi"></text>
									余位：
									<text>{{ item.eptCarports }}</text>
								</view>
								<!-- <view class="top-left-middle">
									<image style="margin-top: 3%;margin-left: 10%;" src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/dibiao.png" mode=""></image>
									
									<view style="margin-top: 3%;margin-left: 10%;" class="top-left-bg"><text class="cuIcon-locationfill"></text>{{ item.title }}</view>
								</view> -->
							</view>
							<view class="top-right">
								<view><image mode="aspectFill" :src="item.parkChargeRulePicUrl"></image></view>
							</view>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<van-divider />
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<view class="hr"></view>
						<!-- #endif -->
						<!-- <view class="foot">
							<view>
								价格:
								<text>{{ item.money / 100 }}元/每小时</text>
							</view>
							<view>
								距您:
								<text>{{ item.dist }}米</text>
							</view>
							<view>
								<button><text>到这去</text></button>
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanDivider from '@/wxcomponents/vant/divider/index';
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
import QQMapWX from '@/js_sdk/qqmap/qqmap-wx-jssdk.js';
import { getLocation } from '../../util/tool.js';
export default {
	components: {
		vanEmpty,
		// #ifdef MP-WEIXIN
		vanDivider
		// #endif
	},
	data() {
		return {
			latitude: '', //纬度
			longitude: '', //经度
			covers: [], //标记点
			coversPlus: [],
			scale: 15,
			menuHeight: 0,
			boxHeight: 0,
			initialHeight: 0,
			text: '',
			adjustPosition: true,
			menuContentHeight: 0,
			qqmapsdk: null,
			recent: [] /*, 距离最近的停车场*/,
			isAuth: true,
			change: 'hide',
			distance: [], //距离
			startData: [],
			windowHeight: 0,
			contentHeight: 400,
			showParkList: false
		};
	},
	onLoad(options) {
		// wx.showShareMenu({
		// 	withShareTicket: true,
		// 	//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
		// 	menus: ['shareAppMessage', 'shareTimeline']
		// });
		this.getKey(1).then(res => {
			this.qqmapsdk = new QQMapWX({
				key: res
			});
		});
	},
	onShow() {
		this.setTabBarIndex(3);
		this.getLocation2();
	},
	mounted() {
		uni.getSystemInfo({
			success: res => {
				this.windowHeight = res.windowHeight;
				this.boxHeight = res.windowHeight * 0.6;
				this.initialHeight = this.boxHeight;
				this.menuHeight = res.windowHeight - this.boxHeight;
				let obj = uni.createSelectorQuery().in(this);
			}
		});
		this.mapCtx = uni.createMapContext('map');
	},
	methods: {
		async getLocation2() {
			await getLocation();
			if (uni.getStorageSync('lot')) {
				this.showParkList = true;
				this.findNearbyParkList();
			}
		},
		//将地图中心移动到当前定位点
		moveToLocation() {
			this.mapCtx.moveToLocation({
				latitude: this.latitude,
				longitude: this.longitude
			});
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
		/* 获取附近停车场 */
		async findNearbyParkList() {
			uni.showLoading({
				title: '加载中...'
			});
			this.longitude = uni.getStorageSync('lot');
			this.latitude = uni.getStorageSync('lat');
			this.$req.request({
				url: 'api/park/findNearbyParkList',
				method: 'get',
				data: {
					lot: this.latitude,
					lat: this.longitude,
					dist: '100000000000',
					parkName: ''
				},
				success: res => {
					for (let i = 0; i < res.data.data.length; i++) {
						// #ifdef MP-WEIXIN
						this.covers.push({
							id: res.data.data[i].id,
							latitude: res.data.data[i].lat,
							longitude: res.data.data[i].lot,
							title: res.data.data[i].parkName,
							iconPath: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车场2.png',
							width: 30 + 'px',
							height: 30 + 'px',
							callout: {
								content: res.data.data[i].parkName,
								color: '#FFF',
								padding: 7,
								bgColor: 'rgb(31,154,228)',
								display: 'ALWAYS',
								borderRadius: 10,
								fontSize: 11
							},
							address: res.data.data[i].address,
							eptCarports: res.data.data[i].eptCarports,
							money: res.data.data[i].toll,
							dist: res.data.data[i].dist,
							// distance: this.distance(this.latitude,this.longitude,res.data.data[i].lat,res.data.data[i].lot)//当前位置到目的地的距离
							// distance: this.calculateDistance(res.data.data[i].lat, res.data.data[i].lot) ? '位置获取失败' : this.distance,
							parkChargeRulePicUrl: res.data.data[i].parkChargeRulePicUrl
						});
						// #endif
						// #ifdef MP-ALIPAY
						this.covers.push({
							id: res.data.data[i].id,
							latitude: res.data.data[i].lat,
							longitude: res.data.data[i].lot,
							title: res.data.data[i].parkName,
							iconPath: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车场2.png',
							width: 30,
							height: 30,
							callout: {
								content: res.data.data[i].parkName,
								color: '#FFF',
								padding: 7,
								bgColor: 'rgb(31,154,228)',
								display: 'ALWAYS',
								borderRadius: 10,
								fontSize: 11
							},
							address: res.data.data[i].address,
							eptCarports: res.data.data[i].eptCarports,
							money: res.data.data[i].toll,
							dist: res.data.data[i].dist,
							// distance: this.distance(this.latitude,this.longitude,res.data.data[i].lat,res.data.data[i].lot)//当前位置到目的地的距离
							// distance: this.calculateDistance(res.data.data[i].lat, res.data.data[i].lot) ? '位置获取失败' : this.distance,
							parkChargeRulePicUrl: res.data.data[i].parkChargeRulePicUrl
						});
						// #endif
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		marker(e) {
			let covers_no = [];
			// 对 e 的值进行判断 点击地图上的标记时,传递多个对象,此时的 typeof(e.callout) 为 undefined, 点击 列表时只传递一个对象 此时的 typeof(e.callout) 为 object
			if (typeof e.callout == 'object') {
				for (let item of this.covers) {
					if (item.id == e.id) {
						uni.setStorageSync('parkingInfo', item);
					} else {
						covers_no.push(item);
					}
				}
			} else {
				for (let item of this.covers) {
					if (item.id == e.detail.markerId) {
						uni.setStorageSync('parkingInfo', item);
					} else {
						covers_no.push(item);
					}
				}
			}
			uni.setStorageSync('covers_no', covers_no);
			uni.navigateTo({
				url: 'spareVehicles'
			});
		},
		toSearch() {
			if (this.text == '') {
				uni.showToast({
					title: '请输入你想要去的停车场',
					icon: 'none'
				});
			} else {
				let covers_new = [];
				this.coversPlus = this.covers;
				for (let item of this.covers) {
					if (item.title.includes(this.text)) {
						covers_new.push(item);
					}
				}
				if (covers_new.length > 0) {
					this.text = '';
					this.coversPlus = [];
					this.coversPlus = covers_new;
				} else {
					this.coversPlus = [];
					this.text = '';
					uni.showToast({
						title: '暂无你搜索的停车场',
						icon: 'none'
					});
				}
			}
		},
		/* 扫码 */
		scanCode() {
			uni.scanCode({
				onlyFromCamera: true,
				scanType: ['qrCode'],
				success: res => {
					uni.navigateTo({
						url: '/' + res.path
					});
				}
			});
		},
		/* 跳转下一级 */
		goLowerLevel(index) {
			if (index == 0) {
				this.scanCode();
			} else if (index == 1) {
				if (this.isLogin('../user/info/price', '2')) {
					uni.navigateTo({
						url: '../user/info/price'
					});
				}
			} else if (index == 2) {
				if (this.isLogin('../index/getaway/getaway', '2')) {
					uni.navigateTo({
						url: 'getaway/getaway'
					});
				}
			} else {
				uni.showToast({
					title: '敬请期待!',
					icon: 'none'
				});
			}
		},
		// 隐藏&显示
		toggle(change) {
			this.boxHeight = this.initialHeight + 200;
			if (change === 'show') {
				this.change = 'hide';
				this.boxHeight = this.boxHeight - this.menuHeight + 30;
			} else if (change === 'upChange') {
				this.contentHeight = this.windowHeight;
			} else {
				this.boxHeight = this.boxHeight + this.menuHeight;
				this.change = 'show';
			}
		},
		// 屏幕滑动开始--结束
		start(e) {
			this.startData.clientX = e.changedTouches[0].clientX;
			this.startData.clientY = e.changedTouches[0].clientY;
		},
		end(e) {
			// const subX = e.changedTouches[0].clientX - this.startData.clientX;
			const subY = e.changedTouches[0].clientY - this.startData.clientY;
			if (subY > 270) {
				this.toggle();
			} else if ((-50 > subY) & (subY > -260)) {
				this.toggle('show');
			} else {
				this.toggle('upChange');
			}
		}
	}
};
</script>

<style>
.content {
	overflow: hidden;
	position: relative;
}

page {
	width: 100%;
	height: 100%;
}

.box {
	width: 100%;
	height: 100%;
}

/* 地图 */
#box-map {
	width: 100%;
	/* height: 60%; */
	position: absolute;
	overflow: hidden;
}

.box-map-content {
	width: 100%;
	/* height: 800rpx; */
	position: relative;
	height: 100%;
}

/* 内容框 */
.box-menu {
	width: 100%;
	background-color: #ffffff;
	border-top-left-radius: 10rpx;
	border-top-right-radius: 10rpx;
	padding-top: 2%;
	position: absolute;
	top: 5%;
	height: 100%;
	border-radius: 25rpx 25rpx 0 0;
	z-index: 888;
}

.box-menu-line {
	border-radius: 20rpx;
	width: 130rpx;
	height: 1%;
	background-color: #cccccc;
	margin: 0 auto;
	margin-bottom: 2%;
}

.box-menu-search {
	width: 90%;
	background-color: rgb(239, 239, 239);
	margin: 0 auto;
	border-radius: 10px;
	height: 75rpx;
	display: flex;
	margin-bottom: 15rpx;
}

.box-menu-search-icon {
	background-image: url(https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/shouye_06.png);
	background-repeat: no-repeat;
	width: 15%;
	height: 100%;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-position: center;
	background-size: 50%;
}

.box-menu-search-input {
	height: 100%;
	width: 70%;
	/* #ifdef MP-ALIPAY */
	background-color: #efefef;
	/* #endif */
}

.box-menu-search-scan {
	background-image: url(https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/shouye_03.png);
	background-repeat: no-repeat;
	width: 15%;
	height: 100%;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background-position: center;
	background-size: 50%;
}

.amap-logo {
	right: 0 !important;
	left: auto !important;
	display: none !important;
}

.amap-controlbar {
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

.box-menu-content {
	width: 90%;
	display: flex;
	margin-top: 2%;
	justify-content: space-around;
	flex-wrap: wrap;
	/* height: 100%; */
	overflow: auto;
	margin: 0 auto;
	align-items: center;
}

.box-menu-content-item {
	width: 100%;
	align-items: center;
}

.top {
	display: flex;
	justify-content: space-around;
	margin-top: 2%;
}

.top view {
	margin-top: 5rpx;
}

.top-left {
	width: 60%;
}

.top-left-item {
	margin: 10rpx 0;
	font-size: 25rpx;
	/* #ifdef MP-ALIPAY */
	margin: 15rpx 0;
	/* #endif */
}

.top-left-item text:nth-of-type(1) {
	margin-right: 10rpx;
}

.top-left-bg {
	background-color: rgb(239, 239, 239);
	border-radius: 10px;
	height: 50rpx;
	line-height: 50rpx;
	padding-left: 20%;
}

.title {
	display: block;
	margin: 0 auto;
	text-align: left;
	font-size: 15px;
	font-weight: bold;
	/* #ifdef MP-ALIPAY */
	font-size: 17px;
	margin-bottom: 10rpx;
	/* #endif */
}

.top-left-middle {
	position: relative;
}

.top-left-middle image {
	width: 150rpx;
	height: 120rpx;
	left: 2%;
	position: absolute;
}

.top-left view {
	/* overflow: hidden;
	text-overflow: ellipsis; */
	white-space: nowrap;
	overflow: hidden;
	white-space: normal;
	word-break: break-all;
}

.top-right {
	width: 40%;
	text-align: center;
}

.top-right image {
	width: 100%;
	height: 180rpx;
	/* #ifdef MP-ALIPAY */
	height: 200rpx;
	/* #endif */
}

.top-right view:last-child {
	font-size: 25rpx;
	margin-left: 10%;
}

.top-right view:last-child text {
	color: red;
}

.foot {
	display: flex;
	justify-content: space-between;
	width: 95%;
	margin: 0 auto;
	height: 75rpx;
	line-height: 75rpx;
}

.foot view:last-child {
	width: 25%;
}

.foot view button {
	margin-top: 5%;
	height: 50rpx;
	width: 80%;
	background-color: #0081ff;
	line-height: 50rpx;
	font-size: 25rpx;
	color: #ffffff;
	border-radius: 20rpx;
	margin-left: 12%;
	background-image: url(https://kshht.gzmsdw.cn/imge_zsyy/html/路标.png);
	background-position: right;
	background-size: 40rpx 40rpx;
	background-repeat: no-repeat;
	box-shadow: 4rpx 4rpx 4rpx rgba(51, 154, 255, 0.6);
}

.foot button text {
	display: block;
	margin-left: -15rpx;
}

.foot view:nth-child(2) {
	margin-left: 5%;
}

.foot view:nth-child(2) text {
	color: red;
	margin-left: 5rpx;
}

/* 显示隐藏动画 */
.show {
	animation: showLayer 0.2s linear both;
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
.hr {
	margin: 40rpx 0rpx;
	height: 2rpx;
	width: 100%;
	margin: 0 auto;
	background-color: rgba(81, 81, 81, 0.1);
}
</style>
