<template>
	<view>
		<view class="action-section" style="width: 100%;" @click="goMyVehicles">
			<view class="cu-bar bg-white solid-bottom " style="width: 100%;">
				<view class="item-plate">
					<view>
						<text class="text-black margin-left">你的车牌号为：</text>
						{{ parkName }}
					</view>
					<view class="item-license-plate">
						我的车牌
						<text class="cuIcon-right"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom"></view>

		<!-- <view class="button margin-top"><button type="primary" size="mini" @click="submit">添加车牌<text class="cuIcon-add radius"></text></button></view> -->
		<view class="margin-top"></view>
		<view class="margin-top" :key="index" v-for="(item, index) in priceList">
			<view class="radius" style="width: 95%; margin: auto;">
				<view class="basis-xl margin-xs bg-white radius">
					<image class="radius" style="width: 100%;height: 400rpx;" :src="item.parkChargeRulePicUrl"></image>
					<view class="container margin-xs padding-xs">
						<view>{{ item.parkName }}</view>
						<view><text class="cu-btn shadow" @click="submit(item)">详情</text></view>
					</view>
					<view class="margin-xs padding-xs">地址：{{ item.address }}</view>
					<view class="margin-xs padding-xs">
						<image class="img" src="https://kshht.gzmsdw.cn/imge_zsyy/html/距离你.png" mode=""></image>
						距离你：{{ item.dist }}米
						<text class="margin-left"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			priceList: '',
			statusID: false,
			parkName: '',
			token: '',
			pid: '',
			cId: ''
		};
	},
	onLoad(option) {},
	onShow() {
		this.token = uni.getStorageSync('userList').accessToken;
		this.parkName = uni.getStorageSync('plateNumber');
		this.pid = uni.getStorageSync('PNDID');
		this.getLocation();
	},

	methods: {
		submit(item) {
			if (this.pid != '') {
				uni.navigateTo({
					// url:"/pagesB/user/info/vehicleBinding/vehicleBinding?item="+encodeURIComponent(JSON.stringify(item)),
					url: `../user/userService/serviceList?parkcode=${item.parkCode}`
				});
			} else {
				uni.showToast({
					title: '请选择绑定的车牌号',
					icon: 'none'
				});
			}
		},
		goMyVehicles() {
			uni.navigateTo({
				url: '../user/info/vehicleBinding/cardList?type=1'
			});
		},
		/* 获取附近停车场 */
		getLocation() {
			/* 让用户授权获取当前位置 */
			uni.authorize({
				scope: 'scope.userLocation',
				success: res => {
					/* 用户点击授权*/
					uni.showLoading({
						title: '请稍后',
						mask: true
					});
					uni.getLocation({
						type: 'gcj02',
						success: res => {
							this.latitude = res.latitude;
							this.longitude = res.longitude;
							this.$req.request({
								url: 'api/park/findNearbyParkList',
								method: 'get',
								data: {
									parkName: '',
									lot: this.latitude,
									lat: this.longitude,
									dist: '100000000'
								},
								success: res => {
									this.priceList = res.data.data;
									this.cmccList(res.data.data[0].parkCode);
									uni.hideLoading();
								},
								complete: data => {}
							});
						}
					});
				}
			});
		},
		cmccList(data) {
			this.$req.request({
				url: 'api/ticket/findTicketList',
				method: 'get',
				data: {
					parkCode: data
				},
				success: res => {},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
.button button {
	width: 100%;
	line-height: 39px;
	box-shadow: 1px 2px 5px rgba(241, 69, 106, 0.4);
	background-image: linear-gradient(45deg, rgb(120, 163, 228), rgb(228, 187, 184));
	border-radius: 20px;
	height: 39px;
	text-align: center;
}
.img {
	height: 1rem;
	width: 1rem;
	margin-right: 15rpx;
	vertical-align: middle;
}

.item-plate {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}
.container {
	display: flex;
}
.container view {
	flex: 1;
}
.container view:nth-of-type(2) {
	text-align: right;
}
.item-license-plate {
	width: 30%;
	text-decoration: underline;
	color: #007aff;
	text-align: center;
}

/* 底部栏 */
.action-section {
	position: fixed;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 100%;
	height: 100upx;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
}

.textright {
	margin-left: 30%;
}
</style>
