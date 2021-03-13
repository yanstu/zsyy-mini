<!-- 主页侧边栏菜单添加修改 -->
<template>
	<view :style=" {height: bgHeight + 'px'}">
		<view class="btn" :class="(showOrhidd == 'show')?'show':'hide'">
			<button type="default" @click="hidden(showOrhidd)">取消</button>
			<view>管理我的应用</view>
			<button type="default" @click="save()">完成</button>
			<view>你可以将常用的应用添加到码上到位首页</view>
		</view>
		<!-- 我的应用 -->
		<view class="application" :class="(showOrhidd == 'show')?'application-height':''">
			<view class="application-title">我的应用</view>
			<ul class="application-app" :class="(showOrhidd == 'show')?'hide':'show'">
				<li v-for="(item, index) in MyApp" :key="index" :style="{ background : item.bgColor }">
					<image :src=" (item.url != undefined)?item.url:item.imgUrl " mode="aspectFill"></image>
				</li>
			</ul>
			<!-- 点击添加后显示的页面 -->
			<ul class="application-app-delOrAdd" :class="showOrhidd">
				<li v-for="(item, index) in MyApp" :key="index" class="animated" hover-class="bounce">
					<image :src=" (item.url != undefined)?item.url:item.imgUrl " :style="{ background : item.bgColor }"  mode="widthFix"></image>
					<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/删除.png" @click="delect(index)" mode="widthFix"></image>
					<view> {{ item.name }} </view>
				</li>
			</ul>
			<view class="addApp" @click="hidden(showOrhidd)" :class="(showOrhidd == 'show')?'hide':'show'">
				<ul>
					<li style="line-height: 100rpx;">+</li>
					<li>添加</li>
				</ul>
			</view>
		</view>
		<!-- 全部应用 -->
		<view class="allApp">
			<view class="allApp-title">全部应用</view>
			<view class="lately-use">
				<!-- <view class="lately-use-title">最近使用</view> -->
				<ul class="lately-use-app" :class="(showOrhidd == 'show')?'hide':'show'">
					<li v-for="(item, index) in possess" :key="index" :class="(index>3)?'lately-use-app-margin':'ture'" :style="{ background : item.bgColor }">
						<image :src=" item.imgUrl " mode="aspectFill"></image>
						<view> {{ item.name }} </view>
					</li>
				</ul>
			</view>
			<!-- 点击添加后显示的页面 -->
			<view class="lately-use">
				<ul class="application-app-delOrAdd" :class="showOrhidd">
					<li v-for="(item, index) in possess" :key="index" class="animated" hover-class="bounce" :class="(index>3)?'lately-use-app-margin':'ture'">
						<image :src=" (item.imgUrl != undefined)?item.imgUrl:item.url " :style="{ background : item.bgColor }" mode="widthFix"></image>
						<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/home_more/添加.png" @click="add(index)" mode="widthFix"></image>
						<view> {{ item.name }} </view>
					</li>
				</ul>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allApp: [],
				MyApp: [],
				bgHeight: 0,
				showOrhidd: "hide",
				possess: [{
						name: '车辆管理',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/车辆.png',
						pageurl: '/pagesB/user/info/vehicleBinding/cardList',
						bgColor: 'rgba(54,212,159)'
					},
					{
						name: '缴费记录',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/缴费.png',
						pageurl: '/pages/pay/payArray',
						bgColor: 'rgba(245,245,245)'
					},
					{
						name: '我的审核',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/我的审核.png',
						pageurl: '/pages/proper/myAudit',
						bgColor: 'rgba(245,245,245)'
					},
					{
						name: '开门记录',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/开门(1).png',
						pageurl: '/pagesB/user/openingRecord',
						bgColor: 'rgba(255,203,87)'
					},
					{
						name: '发票管理',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/发票.png',
						pageurl: '/pages/home/home-nextPage/invoice',
						bgColor: 'rgba(124,107,254,0.5)'
					},
					{
						name: '我的消息',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/my/feedback.png',
						pageurl: '/pagesB/user/msg/msg',
						bgColor: 'rgba(245,245,245)'
					},
					{
						name: '常见问题',
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/问题.png',
						pageurl: '/pagesB/user/problem',
						bgColor: 'rgba(245,245,245)'
					},
					
					
					
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/代人缴费.png',
						name: '代人缴费',
						pageurl: '/pages/service/substitute',
						bgColor: 'rgba(124,107,254,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车优惠券.png',
						name: '停车优惠券',
						pageurl: '/pagesB/user/coupons/coupons',
						bgColor: 'rgba(254,144,37,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/无感支付.png',
						name: '无感支付',
						pageurl: '/pages/service/no-feel',
						bgColor: 'rgb(23,213,248,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/停车费包月.png',
						name: '停车费包月',
						pageurl: '/pages/proper/parkingPackage',
						bgColor: 'rgba(254,144,37,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/车位缴费.png',
						name: '停车缴费',
						pageurl: '/pages/proper/userInfo/stoppay',
						bgColor: 'rgba(93,219,182,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/包月续费.png',
						name: '包月续费',
						pageurl: '/pagesB/user/myMonth/myMonth',
						bgColor: 'rgba(254,144,37,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/欠费记录.png',
						name: '欠费记录',
						pageurl: '/pages/service/arrearage',
						bgColor: 'rgba(227,134,253,0.6)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/预离场.png',
						name: '预离场',
						pageurl: '/pages/index/getaway/getaway',
						bgColor: 'rgba(254,144,37,0.5)'
					},
					// {
					// 	imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/共享车位.png',
					// 	name: '共享车位',
					// 	pageurl: '/pages/index/index',
					// 	bgColor: 'rgb(23,213,248,0.5)'
					// },
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/共享充电桩.png',
						name: '共享充电桩',
						pageurl: '/pages/service/maps?key=充电桩',
						bgColor: 'rgba(124,107,254,0.5)'
					},
					{
						imgUrl: 'https://kshht.gzmsdw.cn/imge_zsyy/html/加油站.png',
						name: '加油站',
						pageurl: '/pages/service/maps?key=加油站',
						bgColor: 'rgba(254,144,37,0.5)'
					}
				]
			}
		},
		onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.allApp = uni.getStorageSync('allApp')
			this.MyApp = uni.getStorageSync('myApp')
			for (let i of this.MyApp) {
				for (let y = 0; y < this.possess.length; y++) {
					if (this.possess[y].name == i.name) {
						this.possess.splice(y, 1)
					}
				}
			}
		},
		onReady() {
			uni.hideLoading()
		},
		mounted() {
			uni.getSystemInfo({
				success: res => {
					this.bgHeight = res.windowHeight
				}
			})
		},
		methods: {
			// 添加修改常用界面
			hidden(showOrhidd) {
				if (showOrhidd == 'hide') {
					this.showOrhidd = 'show'
				} else {
					this.showOrhidd = 'hide'
				}
			},
			// 应用删除
			delect(index) {
				setTimeout(() => {
					this.possess.unshift(this.MyApp[index])
					this.MyApp.splice(index, 1)
				}, '400')
			},
			// 应用添加
			add(index) {
				setTimeout(() => {
					let name = [];
					for (let i of this.MyApp) {
						name.unshift(i.name)
					}
					if (this.MyApp.length == 0) {
						this.MyApp.push(this.possess[index])
					} else if (name.includes(this.possess[index].name) == false) {
						this.MyApp.push(this.possess[index])
						this.possess.splice(index, 1)
					} else {
						uni.showToast({
							title: '该应用已添加',
							imgUrl: 'none'
						})
					}
					this.MyApp = [...new Set(this.MyApp)]
				}, '400')
			},


			//保存修改
			save() {
				var pages = getCurrentPages();
				var currPage = pages[pages.length - 1]; //当前页面
				var prevPage = pages[pages.length - 2]; //上一个页面
				prevPage.setData({
					more: this.MyApp
				})
				// 确认提示框
				uni.showModal({
					title: '提示',
					content: '确认保存吗？',
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack()
						} else if (res.cancel) {
							uni.showToast({
								title: '已取消',
								imgUrl: 'none'
							})
						}
					}
				})
			}
		}

	}
</script>

<style>
	@import url("./animate.css");

	page {
		background: rgb(245, 245, 245);
	}

	/* 控制按钮 */
	.btn {
		display: flex;
		justify-content: space-between;
		width: 100%;
		flex-wrap: wrap;
		text-align: center;
		position: relative;
	}

	.btn view:nth-child(2) {
		line-height: 100rpx;
		font-size: 40rpx;
		color: #1A1A1A;
		font-weight: bold;
	}

	button {
		width: 150rpx;
		height: 20%;
		color: #0081FF;
	}

	.btn view:last-child {
		margin: 3% auto;
	}

	/* 我的应用 */
	.application {
		height: 35%;
		width: 100%;
		margin: 5% auto;
		overflow: auto;
		text-overflow: ellipsis;
	}

	.application-height {
		height: 50%;
	}

	.application-title {
		margin: 0 auto;
		width: 50%;
		font-weight: bold;
		font-size: 40rpx;
		text-align: center;
		margin-top: 5%;
	}

	.application-app {
		display: flex;
		justify-content: center;
		margin-top: 5%;
	}

	.application-app li {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		position: relative;
	}

	.application-app li image:last-child {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.application-app-delOrAdd {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		text-align: center;
	}

	.application-app-delOrAdd li {
		width: 20%;
		height: 150rpx;
		border: 1px dashed #CFCFCF;
		margin: 0 2%;
		margin-top: 5%;
		padding-top: 3%;
		position: relative;
	}

	.application-app-delOrAdd li image {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.application-app-delOrAdd li image:nth-child(2) {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		top: -15rpx;
		position: absolute;
		right: -15rpx;
	}


	/* 添加 */
	.addApp {
		width: 90%;
		margin: 0 auto;
		margin-top: 5%;
		height: 50%;
		border: 1px dashed #CFCFCF;
		justify-content: center;
	}

	.addApp ul li:first-child {
		color: rgb(187, 187, 187);
		margin: 3% auto;
		width: 50%;
		text-align: center;
		font-size: 40rpx;
	}

	.addApp ul li:last-child {
		color: rgb(187, 187, 187);
		margin: 3% auto;
		width: 100rpx;
		text-align: center;
		font-size: 40rpx;
	}

	/* 全部应用 */
	.allApp {
		width: 100%;
		height: 60%;
	}

	.allApp-title {
		text-align: center;
		font-weight: bold;
		font-size: 40rpx;
		margin-top: 5%;
	}

	.lately-use {
		width: 90%;
		margin: 0 auto;
	}

	.lately-use-title {
		font-weight: bold;
		margin: 3% 0 0 0;
		font-size: 35rpx;
	}

	.lately-use-app {
		display: flex;
		/* justify-content: space-between; */
		flex-wrap: wrap;
		margin-top: 2%;
	}

	.lately-use-app li {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		position: relative;
		margin: 0 7%;
		margin-top: 3%;
	}


	.lately-use-app-margin {
		margin-top: 15% !important;
	}

	.lately-use-app li image {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.lately-use-app li view {
		text-align: center;
		margin-top: 5%;
		width: 100rpx;
		position: absolute;
		top: 100%;
		left: -20%;
	}


	.hide {
		display: none;
	}

	.show {
		display: flex;
		flex-wrap: wrap;
	}
</style>
