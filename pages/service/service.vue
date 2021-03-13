<template>
	<view style="height: 100%;width: 100%;">
		<!--  @clickLeft="clickLeft" left-text="停车场" -->
		<!-- #ifdef MP-WEIXIN -->
		<view :style="'height: ' + iStatusBarHeight + 'px;'" class="status-bar"></view>
		<uni-nav-bar title="智慧停车"></uni-nav-bar>
		<!-- #endif -->
		<view class="tips">
			<text class="margin-left" v-if="park.dist < 1000">当前所在{{ park.parkName }}附近</text>
			<text class="margin-left" v-else>当前不在停车场附近</text>
			<text class="margin-right" @click="getParkInfo">刷新定位</text>
		</view>
		<view class="item">
			<!-- #ifdef MP-WEIXIN -->
			<view class="cu-bar bg-white">
				<view class="action border-title">
					<text class="text-xl text-green">缴费服务</text>
					<text class="bg-gradual-blue" style="width:3rem"></text>
				</view>
			</view>
			<van-grid clickable="true" column-num="3">
				<van-grid-item v-for="(item, index) in list1" :key="item" :icon="item.icon" @click="goPage(item)" :text="item.name" />
			</van-grid>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="cu-bar bg-white"><text class="text-xl text-green margin-left">缴费服务</text></view>
			<van-grid :column="3" :square="false">
				<van-grid-item class="g-item" v-for="(item, index) in list1" :key="item">
					<view @click="goPage(item)" class="g-item-con">
						<view class="g-item-icon"><van-icon size="60rpx" :name="item.icon" /></view>
						<view class="g-item-lable">{{ item.name }}</view>
					</view>
				</van-grid-item>
			</van-grid>
			<!-- #endif -->
		</view>
		<view class="item">
			<!-- #ifdef MP-WEIXIN -->
			<view class="cu-bar bg-white">
				<view class="action border-title">
					<text class="text-xl text-blue">便携服务</text>
					<text class="bg-gradual-blue" style="width:3rem"></text>
				</view>
			</view>
			<van-grid column-num="3">
				<van-grid clickable="true" column-num="3">
					<van-grid-item
						v-for="(item, index) in list2"
						:key="item"
						:icon="item.icon"
						@click="goPage(item)"
						:link-type="item.name == '共享车位' ? 'switchTab' : 'navigateTo'"
						:text="item.name"
					/>
				</van-grid>
			</van-grid>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="cu-bar bg-white"><text class="text-xl text-blue margin-left">便携服务</text></view>
			<van-grid :column="3" :square="false">
				<van-grid-item class="g-item" v-for="(item, index) in list2" :key="item">
					<view @click="goPage(item)" class="g-item-con">
						<view class="g-item-icon"><van-icon size="60rpx" :name="item.icon" /></view>
						<view class="g-item-lable">{{ item.name }}</view>
					</view>
				</van-grid-item>
			</van-grid>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
import vanGrid from '@/components/uni-grid/components/uni-grid/uni-grid.vue';
import vanGridItem from '@/components/uni-grid/components/uni-grid-item/uni-grid-item.vue';
import vanIcon from '@/components/vant/icon/index';
// #endif
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
import vanGrid from '@/wxcomponents/vant/grid/index';
import vanGridItem from '@/wxcomponents/vant/grid-item/index';
// #endif
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import { getLocation } from '../../util/tool.js';
export default {
	components: {
		uniNavBar,
		vanEmpty,
		vanGrid,
		vanGridItem,
		// #ifdef MP-ALIPAY
		vanIcon
		// #endif
	},
	data() {
		return {
			iStatusBarHeight: 22,
			massage: '',
			park: null,
			list1: [
				/*{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/充值包月.png',
					name: '用户充值',
					url: '/pagesB/user/info/price'
				},*/
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/代人缴费.png',
					name: '代人缴费',
					url: '/pages/service/substitute'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车优惠券.png',
					name: '停车优惠券',
					url: '/pagesB/user/coupons/coupons'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/无感支付.png',
					name: '无感支付',
					url: '/pages/service/no-feel'
				},
				/*{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/扫码支付.png',
					name: '扫码支付',
					url: '/pages/index/ves-com-out/ves-com-out'
				},*/
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车费包月.png',
					name: '停车费包月',
					url: '/pages/proper/parkingPackage'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/车位缴费.png',
					name: '停车缴费',
					url: '/pages/proper/userInfo/stoppay'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/包月续费.png',
					name: '包月续费',
					url: '/pagesB/user/myMonth/myMonth'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/欠费记录.png',
					name: '欠费记录',
					url: '/pages/service/arrearage'
				}
			],
			list2: [
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/预离场.png',
					name: '预离场',
					url: '/pages/index/getaway/getaway'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/一键移车.png',
					name: '一键移车',
					url: ''
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/共享车位.png',
					name: '共享车位',
					url: '/pages/index/index'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/共享充电桩.png',
					name: '共享充电桩',
					url: '/pages/service/maps?key=充电桩'
				},
				{
					icon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/加油站.png',
					name: '加油站',
					url: '/pages/service/maps?key=加油站'
				}
			]
		};
	},
	onShow() {
		this.setTabBarIndex(0);
		this.iStatusBarHeight = getApp().globalData.statusBarHeight;
		this.showMassage();
		this.getParkInfo();
	},
	methods: {
		async getParkInfo() {
			await getLocation();
			if (uni.getStorageSync('lot')) {
				this.findNearbyParkList();
			}
		},
		/* 获取附近停车场 */
		async findNearbyParkList() {
			var lot = uni.getStorageSync('lot');
			var lat = uni.getStorageSync('lat');
			this.$req.request({
				url: 'api/park/findNearbyParkList',
				method: 'get',
				data: {
					dist: '50000000',
					lat: lot,
					lot: lat,
					parkName: ''
				},
				success: res => {
					if (res.data.data.length > 0) {
						this.park = res.data.data[0];
					}
					uni.setStorageSync('parkInfo', this.park);
				},
				complete: data => {}
			});
		},
		clickLeft() {
			console.log(1);
		},
		goPage(item) {
			if (item.name == '一键移车') {
				wx.navigateToMiniProgram({
					appId: 'wxf33d9a42c50b5db4',
					path: 'pages/other/yctx_index',
					envVersion: 'release'
				});
				return;
			}
			if (item.name == '共享充电桩') {
				uni.navigateTo({
					url: item.url
				});
				return;
			}
			if (item.name == '共享车位') {
				uni.switchTab({
					url: item.url
				});
				return;
			}
			if (item.name == '预离场') {
				if (!uni.getStorageSync('parkInfo')) {
					this.getParkInfo();
				} else {
					uni.navigateTo({
						url: item.url
					});
				}
				return;
			}
			if (item.name == '加油站' || item.name == '共享充电桩') {
				if (!uni.getStorageSync('lat')) {
					getLocation();
				} else {
					uni.navigateTo({
						url: item.url
					});
				}
				return;
			}
			if (item.url) {
				if (this.isLogin()) {
					uni.navigateTo({
						url: item.url
					});
				}
			} else {
				uni.showToast({
					title: '敬请期待',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style>
.status-bar {
	background: #ffffff;
}
.tips {
	font-size: 25rpx;
	margin: 20rpx 0;
	color: #838383;
	display: flex;
	/* #ifdef MP-ALIPAY */
	padding-top: 20rpx;
	/* #endif */
}
.tips text {
	flex: 1;
}
.tips text:nth-of-type(2) {
	text-align: right;
}
.catlogin {
	background: #1aad19;
	color: #ffffff;
	width: 80%;
	margin: auto;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	margin-top: 500rpx;
	border-radius: 50rpx;
}
.item {
	margin: 20rpx 10rpx;
	/* #ifdef MP-ALIPAY */
	margin: 20rpx 0rpx;
	/* #endif */
}
.item-title {
	height: 100rpx;
}
.van-icon__info {
	display: none;
}
.info-index {
	display: none;
}
.g-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.g-item-con {
	padding: 20rpx;
}
.g-item-icon,
.g-item-lable {
	text-align: center;
	margin: 6rpx;
}
.g-item-lable {
	font-size: 25rpx;
}
</style>
