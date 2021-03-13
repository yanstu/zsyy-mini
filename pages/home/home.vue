<template>
	<view class="container" :style="{ height: bgHeight + 'px' }" @click="changes(change)">
		<!-- #ifdef MP-WEIXIN -->
		<show-tips></show-tips>
		<!-- #endif -->
		<!-- 轮播 -->
		<view class="lunbo" :style="{ height: bgHeight + 'px' }">
			<swiper :circular="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in bgImage" :key="index">
					<image class="image" :src="item.url"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 搜索 - 天气 -->
		<view class="search" :style="{ top: top + 'px' }">
			
			
			<view v-if="weather.length == 0 ? false : true"
				style="width: 100px; height: 32px; position: absolute; top: -2px; left: -105px; text-align: center;">
				{{ weather.city }}市 {{ weather.info.type }}
				<view>{{ weather.info.low.slice(3) }} ~ {{ weather.info.high.slice(3) }}</view>
			</view>
			
			
			<view class="box-menu-search" @click.stop="openTab">
				<view class="box-menu-search-icon"></view>
				<input class="box-menu-search-input" type="text" placeholder="请输入目的地"
					placeholder-style="color:rgb(232,240,252);" />
			</view>
		</view>
		
		
		<!-- 提供服务 -->
		<view class="service">
			<ul>
				<li v-for="(item, index) in menuList" :key="index" @click.stop="goLowerlevel(index, change)">
					<view class="service-bg" :style="{ background: item.color }">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
					<text>{{ item.name }}</text>
				</li>
			</ul>
		</view>

		<!-- 通知栏 -->
		<view style="background: rgba(83,83,83,0.2); position: absolute;bottom: 10%;" class="view1">
			<van-notice-bar speed="20" backgroundColor="#00000000" scrollable color="#ffffff"
				custom-class="custom-class" left-icon="volume-o" :showIcon="true" single
				:text="notifications[0].title" />
		</view>

		<!-- 更多 -->
		<view class="service-more animated bounce" :style="{ height: bgHeight + 'px' }" :class="change">
			<ul>
				<view style="overflow: auto; height: 68%; position: absolute; width: 100%; top: 8%;">
					<li v-for="(item, index) in more" :key="index" @click.stop="moreMenu(item.name, item)">
						<view>
							<view class="service-bg service-bg-change" style="width: 20%;"
								:style="{ background: item.bgColor }">
								<image :src="item.url != undefined ? item.url : item.imgUrl" mode="aspectFill"></image>
							</view>
							<view>{{ item.name }}</view>
						</view>
						<view class="jiantou"><text class="cuIcon-right"></text></view>
					</li>
				</view>

				<view style="position: absolute; width: 100%; bottom: 8%; display: flex;">
					<li class="bianji" style="border-right: 1px dashed rgba(118,118,118,0.3); padding-left: 5%;">
						<!-- #ifdef  MP-WEIXIN -->
						<view class="service-bg service-bg-change" style="background: rgba(254,114,97,0.5);">
							<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/客服.png" mode="aspectFill">
							</image>
						</view>
						<button type="default" open-type="contact">
							<view class="banji-text"><text>在线客服</text></view>
						</button>
						<!-- #endif -->


						<!-- #ifdef  MP-ALIPAY -->
						<contact-button tnt-inst-id="1Nc_16I2" scene="SCE01045292" color="#EDACAB" size="72rpx">
						</contact-button>
						<text class="text" style="width: 100%; padding-left: 65%;">在线客服</text>
						<!-- #endif -->
					</li>

					<li class="bianji" style="padding-left: 6%;" @click.stop="nextPage">
						<view class="service-bg service-bg-change" style="background: rgba(124,185,254,0.5); ">
							<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/发票.png" mode="aspectFill">
							</image>
						</view>
						<view class="banji-text" style="padding-left: 27%; bottom: 0;"><text class="text">编辑</text>
						</view>
					</li>
				</view>
			</ul>
		</view>
	</view>
</template>

<script>
	// #ifdef MP-WEIXIN
	import vanNoticeBar from '@/wxcomponents/vant/notice-bar/index';
	// #endif
	// #ifdef MP-ALIPAY
	import vanNoticeBar from '@/components/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.vue';
	// #endif
	import showTips from '@/components/redflower-showTips/redflower-showTips.vue';
	export default {
		components: {
			showTips,
			vanNoticeBar
		},
		onShow(e) {
			this.setTabBarIndex(2);
			this.showMassage();

			// 天气加载
			uni.request({
				// #ifdef MP-WEIXIN
				url: 'https://api.vvhan.com/api/weather?city=贵阳',
				// #endif
				// #ifdef MP-ALIPAY
				url: 'https://api.vvhan.com/api/weather',
				// #endif 
				method: 'GET',
				success: res => {
					this.weather = res.data;
				},
				fail: res => {},
				complete: () => {}
			});

			// 获得下级页面传递上来的参数
			let pages = getCurrentPages();
			let currPage = pages[pages.length - 1];
			if (currPage.data.more == undefined || currPage.data.title == '') {} else {
				this.more = currPage.data.more;
				uni.setStorageSync('userApp', currPage.data.more);
				uni.setStorage({
					key: 'app',
					data: currPage.data.more
				});
			}
			uni.setStorageSync('myApp', this.more);
			uni.setStorageSync('allApp', this.more);
			uni.getStorage({
				key: 'app',
				success: function(res) {}
			});
			var userApp = uni.getStorageSync('userApp');
			uni.login({
				success: res => {
					var code = res.code;
				}
			});
		},
		data() {
			return {
				bgImage: [{
					url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/shouye_lunbo1.jpg'
				}],
				bgHeight: 0,
				menuList: [{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/扫码.png',
						name: '扫码支付',
						color: 'rgba(254,114,97,0.9)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/查询子目和材料.png',
						name: '车位查询',
						color: 'rgba(253,190,49,0.9)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/充值.png',
						name: '用户充值',
						color: 'rgba(124,107,254,0.9)'
					},
					// {
					// 	url:'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/充电桩.png',
					// 	name:'充电桩查询',
					// 	color: 'rgba(227,134,253,0.6)'
					// },
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/车辆离开.png',
						name: '预离场',
						color: 'rgba(254,144,37,0.9)'
					},
					// {
					// 	url:'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/共享电车.png',
					// 	name:'共享车位',
					// 	color: 'rgb(23,213,248,0.5)'
					// },
					// {
					// 	url:'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/会员缴费.png',
					// 	name:'代人缴费',
					// 	color: 'rgba(113,183,254,0.5)'
					// },
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/更多.png',
						name: '更多',
						color: 'rgba(93,219,182,0.9)'
					}
				],
				more: [{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/停车缴费.png',
						name: '停车充值',
						bgColor: 'rgba(254,144,37,0.5)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/小区管理.png',
						name: '我的物业',
						bgColor: 'rgb(23,213,248,0.5)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/物业缴费.png',
						name: '物业缴费',
						bgColor: 'rgba(227,134,253,0.6)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/优惠券.png',
						name: '停车优惠券',
						bgColor: 'rgba(253,190,49,0.5)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/新闻.png',
						name: '新闻资讯',
						bgColor: 'rgba(113,183,254,0.5)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/发票.png',
						name: '发票管理',
						bgColor: 'rgba(124,107,254,0.5)'
					},
					{
						url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/系统.png',
						name: '系统通知',
						bgColor: 'rgba(93,219,182,0.5)'
					}
					// {
					// 	url: 'https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/客服.png',
					// 	name: '客服在线咨询',
					// 	bgColor: 'rgba(254,114,97,0.5)'
					// },
				],
				change: 'hide',
				myApp: [],
				top: 0,
				weather: [],
				notifications: []
			};
		},
		onLoad() {
			this.getNotificationsList();
		},
		onReady() {
			uni.hideLoading();
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.bgHeight = res.windowHeight;
				}
			});
			// #ifdef MP-WEIXIN
			this.top = wx.getMenuButtonBoundingClientRect().top;
			// #endif
			// #ifdef MP-ALIPAY
			this.top = uni.getSystemInfoSync().titleBarHeight / 2 + uni.getSystemInfoSync().statusBarHeight - 32 / 2;
			// #endif
			uni.getStorageSync();
		},
		methods: {
			async getNotificationsList() {
				const ret = await this.$req.synchro({
					url: 'api/banner/getDetail',
					method: 'get',
					data: {
						pageIndex: 1,
						pageSize: 1000,
						communityId: 0
					}
				});
				this.notifications = ret.data.data;
			},
			openTab(e) {
				uni.switchTab({
					url: '/pages/index/index'
				});
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
			// 显示隐藏
			changes(change) {
				if (this.change == 'hide') {
					this.change = 'show';
				}
				if (this.change == 'hidd') {
					this.change = 'show';
				} else {
					this.change = 'hidd';
				}
			},

			// 页面切换
			goLowerlevel(index, change) {
				if (index == 0) {
					// 扫码支付
					this.scanCode();
				} else if (index == 1) {
					// 车位查询
					this.openTab();
				} else if (index == 2) {
					// 用户充值
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../../pagesB/user/info/price',
							success() {
								let page = getCurrentPages().pop(); //跳转页面成功之后
								if (!page) return;
								page.onLoad(); //如果页面存在，则重新刷新页面
							}
						});
					}
				} else if (index == 3) {
					// 预离场
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../index/getaway/getaway'
						});
					}
				} else {
					// 更多
					this.changes(change);
				}
			},
			// 前往编辑页面
			nextPage() {
				uni.navigateTo({
					url: '../../pagesA/home/edit'
				});
			},
			//侧边栏菜单页面跳转
			moreMenu(index, item) {
				if (index == '停车充值') {
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../../pagesB/user/info/price'
						});
					}
				} else if (index == '小区物业通知') {
					if (this.isLogin()) {
						if (this.isBindXiaoQu()) {
							uni.navigateTo({
								url: '../../pagesB/user/info/proper'
							});
						}
					}
				} else if (index == '物业缴费') {
					if (this.isLogin()) {
						if (this.isBindXiaoQu()) {
							uni.navigateTo({
								url: '../proper/userInfo/Property'
							});
						}
					}
				} else if (index == '停车优惠券') {
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../proper/coupon'
						});
					}
				} else if (index == '新闻资讯') {
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../../pagesA/home/home-nextPage/news'
						});
					}
				} else if (index == '发票管理') {
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../../pagesA/home/home-nextPage/invoice'
						});
					}
				} else if (index == '系统通知') {
					if (this.isLogin()) {
						uni.showToast({
							title: '暂未拥有系统消息',
							icon: 'none'
						});
					}
				} else if (index == '客服在线咨询') {
					if (this.isLogin()) {
						uni.navigateTo({
							// url: '../user/servicesDetails'
						});
					}
				} else {
					if (item) {
						if (this.isLogin()) {
							uni.navigateTo({
								url: item.pageurl
							});
						}
					}
				}
			}
		}
	};
</script>

<style>
	/* #ifdef MP-ALIPAY */
	page {
		overflow: hidden;
	}

	.search {
		left: 18% !important;
	}

	contact-button {
		position: absolute;
		width: 200rpx !important;
	}

	.view1 {
		height: 60rpx !important;
		bottom: 0 !important;
	}

	.box-menu-search-input {
		height: 100% !important;
		background: none !important;
	}

	.text {
		display: block;
		margin-left: -60rpx !important;
	}

	/* #endif */

	page {
		background: rgb(244, 244, 244);
		margin: 0;
		padding: 0;
	}

	.container {
		position: relative;
		background: rgb(244, 244, 244);
	}

	.top-select-input {
		/* position: absolute; */
		top: 0;
	}

	/* 搜索栏 */
	.search {
		height: 32px;
		background-color: rgba(238, 239, 243, 0.6);
		position: relative;
		width: 45%;
		margin: 0 auto;
		border-radius: 50rpx;
		/* #ifdef MP-WEIXIN */
		margin-right: 28.5%;
		/* #endif */
		/* #ifdef MP-ALIPAY */
		margin-right: 45%;
		/* #endif */
	}

	.box-menu-search {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		height: 30px;
		margin-left: 5px;
	}

	.box-menu-search-icon {
		background-image: url(https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/搜索.png);
		background-repeat: no-repeat;
		width: 20%;
		height: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background-position: center;
		background-size: 80%;
	}

	.box-menu-search-input {
		height: 20%;
		width: 75%;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 10%;
		margin: auto;
		font-size: 30rpx;
	}

	/* 轮播 */
	.lunbo {
		width: 100%;
		position: absolute;
	}

	.lunbo swiper {
		height: 100%;
		width: 100%;
	}

	.image {
		width: 100%;
		height: 100%;
	}

	/* 服务 */
	.service {
		position: absolute;
		top: 10%;
		width: 95%;
		right: 0;
		left: 0;
		margin: auto;
		opacity: 1;
	}

	.service ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		text-align: center;
		width: 100%;
	}

	.service ul li {
		flex: 1;
		width: 16%;
		min-width: 16%;
		max-width: 16%;
		margin-top: 5%;
	}

	.service ul li text {
		display: block;
		margin-top: 15%;
		color: #1c1c1c;
		/*font-weight: bold;*/
		font-size: 28rpx;
		font-weight: 530;
	}

	.service-bg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin: 0 auto;
		position: relative;
		margin-top: 10%;
	}

	.service-bg image {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
		width: 50rpx;
		height: 50rpx;
	}

	/* 更多 */
	.service-more {
		top: 0;
		right: 0;
		position: absolute;
		width: 70%;
		background-color: rgb(235, 235, 241);
		z-index: 2;
		overflow: auto;
		opacity: 0.96;
		border-top-left-radius: 60rpx;
	}

	.service-more ul li {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		background-color: #00000000;
		height: 100rpx;
		margin-top: 0.8%;
	}

	.jiantou {
		margin-top: -2%;
	}

	.service-more ul li:first-child {
		/* margin-top: 25%; */
	}

	.service-more ul li view:first-child {
		display: flex;
		justify-content: space-between;
		width: 70%;
	}

	.service-more ul li view:first-child view {
		padding-top: 4%;
		margin-left: 5%;
		width: 80%;
	}

	/* 编辑 */
	.bianji {
		width: 100%;
		position: relative;
	}

	.bianji button {
		width: 60%;
		height: 70rpx;
		margin-left: 0;
		text-align: left;
	}

	button[type='default'] {
		background: #00000000;
		opacity: 0.96;
		color: #000000;
	}

	button::after {
		border: 0;
	}

	.bianji button view {
		margin-left: -15% !important;
		width: 100% !important;
		font-size: 28rpx !important;
		color: rgb(59, 58, 60);
	}

	.bianji button view text {
		padding-bottom: 3% !important;
		line-height: 50rpx;
	}

	.bianji view {
		width: 70rpx !important;
		height: 70rpx !important;
		margin-left: 3%;
	}

	.banji-text {
		text-align: center;
		position: absolute;
		left: 14%;
		margin-top: 10rpx;
	}

	.banji-text text {
		width: 200rpx !important;
	}

	.service-bg-change {
		margin: 0;
		width: 90rpx !important;
		height: 60rpx !important;
	}

	/* #ifdef MP-ALIPAY */
	.service-bg-change {
		margin: 0;
		width: 90rpx !important;
		height: 75rpx !important;
	}

	.service-bg-change image {
		vertical-align: middle;
	}

	/* #endif */

	.service-more ul li view:last-child {
		padding-top: 3%;
		margin-right: 5%;
	}

	.show {
		animation: showLayer 0.2s linear both;
	}

	.hide {
		display: none;
	}

	.hidd {
		animation: hideLayer 0.2s linear both;
	}

	@keyframes showLayer {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(100%); //这里可以通过变大变小调整偏移量
		}
	}

	@keyframes hideLayer {
		0% {
			transform: translateX(100%);
		}

		100% {
			transform: translateX(0);
		}
	}

	.view1 {
		width: 100%;
		height: 70rpx;
	}

	.custom-class {}
</style>
