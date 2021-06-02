<template>
	<view>
		<scroll-view scroll-y class="scrollPage">
			<view class="UCenter-bg">
				<view class="cu-avatar xl round box-headImg" @click="goMyInfo" v-if="uId"
					:style="{ backgroundImage: 'url(' + uId.avatarUrl + ')' }"></view>
				<view class="cu-avatar xl round box-headImg"
					style="background-image: url(https://kshht.gzmsdw.cn/imge_zsyy/html/my/mine_def_touxiang_3x.png);"
					v-else></view>
				<view class="box-login" v-if="uId" @click="goMyInfo">{{ uId.nickname }}</view>
				<view class="box-login" @tap="login" v-else>未登录</view>
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/wave.gif" mode="scaleToFill" class="gif-wave">
				</image>
			</view>
			<view class="padding flex text-center text-grey bg-white shadow-warp">
				<view @tap="goMyBalance" class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-orange">{{ balance / 100 }}元</view>
					<view class="margin-top-sm">余额</view>
				</view>
				<view @tap="goMyCoupon" class="flex flex-sub flex-direction solid-right">
					<view class="text-xxl text-blue">{{ couponNum }}张</view>
					<view class="margin-top-sm">优惠券</view>
				</view>
				<view @tap="goMyMonth" class="flex flex-sub flex-direction">
					<view class="text-xxl text-green">{{ isMyMonth == 0 ? '无' : '查看' }}</view>
					<view class="margin-top-sm">包月</view>
				</view>
			</view>
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow">
					<!-- #ifdef MP-ALIPAY -->
					<view class="content" style="display: flex;" @click="goMyOrder">
						<view class="aliView">
							<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/服务.png" class="png" mode="aspectFit">
							</image>
						</view>
						<text class="text-grey">我的服务</text>
					</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<navigator class="content" @click="goMyOrder" hover-class="none">
						<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/服务.png" class="png" mode="aspectFit"></image>
						<text class="text-grey">我的服务</text>
					</navigator>
					<!-- #endif -->
				</view>



				<!-- 商家 优惠券  -->
				<view class="cu-item arrow" v-if="(level == 2)">
					<!-- #ifdef MP-ALIPAY -->
					<view class="content" style="display: flex;" @click="goMyOrder(2)">
						<view class="aliView">
							<image src="https://ftp.bmp.ovh/imgs/2021/03/c3889caa51c04f60.png" class="png"
								mode="aspectFit"></image>
						</view>
						<text class="text-grey">商家优惠券</text>
					</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<navigator class="content" @click="goMyOrder(2)" hover-class="none">
						<image src="http://file.gzmsdw.cn/zsyy/e1300753d7dc4f52a15ab8277b434869.png" class="png" mode="aspectFit">
						</image>
						<text class="text-grey">商家优惠券</text>
					</navigator>
					<!-- #endif -->
				</view>
			</view>

			<!-- #ifdef  MP-ALIPAY -->
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow" v-for="(item, index) of menuList" :key="index">
					<view class="content" style="display: flex;" @click="goLowerlevel(item.name)" hover-class="none">
						<view class="aliView">
							<image :src="item.imgUrl" class="png" mode="widthFix"></image>
						</view>
						<!-- <text class="cuIcon-github text-grey"></text> -->
						<text class="text-grey">{{ item.name }}</text>
					</view>
				</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-WEIXIN -->
			<view class="cu-list menu card-menu margin-top-xl margin-bottom-xl shadow-lg radius">
				<view class="cu-item arrow" v-for="(item, index) of menuList" :key="index">
					<navigator class="content" @click="goLowerlevel(item.name)" hover-class="none">
						<image :src="item.imgUrl" class="png" mode="aspectFit"></image>
						<!-- <text class="cuIcon-github text-grey"></text> -->
						<text class="text-grey">{{ item.name }}</text>
					</navigator>
				</view>
			</view>

			<!-- #endif -->

			<view class="cu-tabbar-height"></view>
			<van-dialog show-cancel-button @close="closeDialog" use-slot title="请选择当前所在小区及单元" :show="dialogShow"
				@confirm="bind">
				<view class="cu-form-group">
					<view>小区</view>
					<view class="action text-right" @click="goComSel">
						{{ item.name == null ? '选择' : item.name }}
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<view>单元</view>
					<view class="action text-right" @click="goUnit">
						{{ item == null ? '请先选择小区' : unit == null ? '去选择' : unit.unitName }}
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</van-dialog>
		</scroll-view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	// #ifdef MP-WEIXIN
	import vanDialog from '@/wxcomponents/vant/dialog/index';
	// #endif
	// #ifdef MP-ALIPAY
	import vanDialog from '@/components/vant/dialog/index';
	// #endif
	export default {
		components: {
			uniNavBar,
			vanDialog
		},
		data() {
			return {
				statusID: false,
				uId: {},
				status: false,
				balance: 0,
				token: '',
				couponNum: 0,
				isMyMonth: 0,
				dialogShow: false,
				unit: null,
				item: null,
				level: null, //商家状态码 2 为商家
				menuList: [{
						name: '车辆管理',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/车辆.png'
					},
					{
						name: '缴费记录',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/缴费.png'
					},
					{
						name: '更换小区',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/更换小区.png'
					},
					/*{
							name: '我的物业',
							imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/我的物业.png'
						},*/
					{
						name: '我的审核',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/我的审核.png'
					},
					{
						name: '开门记录',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/开门\(1\).png'
					},
					{
						name: '发票管理',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/发票.png'
					},
					{
						name: '我的消息',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/my/feedback.png'
					},
					/*{
							name: '无感支付',
							imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/无感支付.png'
						},*/
					{
						name: '常见问题',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/问题.png'
					},
					{
						name: '设置',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/设置.png'
					}
					/*{
							name: '关于我们',
							imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/关于.png'
						}*/
				]
			};
		},
		onShow() {
			this.setTabBarIndex(4);
			this.showMassage();
			this.uId = uni.getStorageSync('userList');
			this.token = uni.getStorageSync('userList').accessToken;
			this.level = uni.getStorageSync('level');
			if (this.token) {
				this.getMyBlance();
				this.getUserCoupon();
				this.getMyMonthInfo();
			}
		},
		methods: {
			closeDialog() {
				this.dialogShow = false;
			},
			bind() {
				if (this.item && this.unit) {
					uni.setStorageSync('currC', this.item);
					uni.setStorageSync('currU', this.unit);
				}
				this.dialogShow = false;
			},
			goComSel() {
				this.unit = null;
				uni.navigateTo({
					url: '../proper/ownerInfoInput/communitySelection/communitySelection?type=1&showType=1'
				});
			},
			goUnit() {
				if (this.item == null) {
					return;
				}
				uni.navigateTo({
					url: '../proper/ownerInfoInput/unit/unit?cId=' + this.item.communityId
				});
			},
			/* 跳转到我的信息 */
			goMyInfo() {
				uni.navigateTo({
					url: 'myInfo'
				});
			},
			goLowerlevel(name) {
				switch (name) {
					case '车辆管理':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesB/user/info/vehicleBinding/cardList'
							});
						}
						break;
					case '缴费记录':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../pay/payArray'
							});
						}
						break;
					case '我的审核':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../proper/myAudit'
							});
						}
						break;
					case '开门记录':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesB/user/openingRecord'
							});
						}
						break;
					case '发票管理':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesA/home/home-nextPage/invoice'
							});
						}
						break;
					case '我的消息':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesB/user/msg/msg'
							});
						}
						break;
					case '更换小区':
						if (this.isLogin()) {
							this.dialogShow = true;
						}
						break;
					case '我的物业':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesB/user/info/proper'
							});
						}
						break;
					case '常见问题':
						uni.navigateTo({
							url: '../../pagesB/user/problem'
						});
						break;
					case '设置':
						if (this.isLogin()) {
							uni.navigateTo({
								url: '../../pagesB/user/settings/settings'
							});
						}
						break;
				}
			},
			/* 跳转到我的服务 */
			goMyOrder(num) {
				if (num != 2) {
					if (this.isLogin()) {
						uni.navigateTo({
							url: '../../pagesB/user/myServices'
						});
					}
				} else {
					uni.navigateTo({
						url: './businessCoupons'
					});
				}
			},
			/* 跳转到我的包月 */
			goMyMonth() {
				if (this.isLogin()) {
					if (this.isMyMonth == 0) {
						uni.showToast({
							title: '你还没有开通任何包月服务,赶紧去开通吧~~',
							icon: 'none'
						});
					} else {
						uni.navigateTo({
							url: '../../pagesB/user/myMonth/myMonth'
						});
					}
				}
			},
			//获取用户包月信息
			getMyMonthInfo() {
				this.$req.request({
					url: 'api/ticket/findMyMonthTicketList',
					method: 'get',
					data: {
						parkCode: ''
					},
					success: res => {
						if (res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.isMyMonth = 1;
							} else {
								this.isMyMonth = 0;
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {}
				});
			},
			/* 去我的优惠券 */
			goMyCoupon() {
				if (this.isLogin()) {
					uni.navigateTo({
						url: '../../pagesB/user/coupons/coupons'
					});
				}
			},
			/* 优惠券 未使用 */
			getUserCoupon() {
				this.$req.request({
					url: 'api/coupon/getUserCoupons',
					data: {
						status: 1
					},
					success: res => {
						if (res.data.code == 200) {
							this.couponNum = res.data.data.length;
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {}
				});
			},
			/* 查询余额 */
			getMyBlance() {
				this.$req.request({
					url: 'api/user/getUserBalance',
					method: 'get',
					success: res => {
						if (res.data.code == 200) {
							this.balance = res.data.data;
						} else {
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
			/* 跳转到我的余额 */
			goMyBalance() {
				if (this.isLogin()) {
					uni.navigateTo({
						url: '../../pagesB/user/info/balance?balance=' + this.balance
					});
				}
			},
			login() {
				if (this.statusID) {
					var SUID = uni.getStorageSync('userList');
					this.token = SUID.accessToken;
					this.$req.request({
						url: 'api/user/logout',
						success: data => {
							if (data.data.code == 200) {
								uni.removeStorageSync('userInfo');
								uni.clearStorageSync();
								uni.showToast({
									title: '退出成功',
									icon: 'none',
									success: data => {
										this.statusID = false;
									}
								});
							} else {
								uni.showToast({
									title: data.data.msg,
									icon: 'none'
								});
							}
						},
						complete: data => {}
					});
				} else {
					uni.navigateTo({
						url: '/pages/register/wxlogin'
					});
				}
			}
		},
		filters: {
			numFilter(value) {
				// 截取当前数据到小数点后两位
				let realVal = parseFloat(value).toFixed(2);
				return realVal;
			}
		}
	};
</script>
<style>
	/* #ifdef  MP-ALIPAY */
	page {
		overflow: auto;
	}

	.aliView {
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}

	/* #endif */

	.UCenter-bg {
		background-image: url('https://kshht.gzmsdw.cn/imge_zsyy/html/my/mine_bg_3x.png');
		background-size: cover;
		height: 400rpx;
		display: flex;
		justify-content: center;
		padding-top: 40rpx;
		overflow: hidden;
		position: relative;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-weight: 300;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
	}

	.content image {
		vertical-align: middle;
	}

	.box-login {
		width: 200rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
	}

	.UCenter-bg text {
		opacity: 0.8;
	}

	.UCenter-bg image {
		width: 200rpx;
		height: 200rpx;
	}

	.UCenter-bg .gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}

	map,
	.mapBox {
		width: 750rpx;
		height: 300rpx;
	}
</style>
