<template>
	<view>
		<!-- 选项卡 -->
		<scroll-view scroll-x class="bg-white nav text-center fixed option" :style="[{ top: CustomBar + 'px' }]">
			<view class="cu-item" :class="index == TabCur ? 'cu-item_active' : ''" v-for="(item, index) in tabNav" :key="index" @tap="tabSelect" :data-id="index">
				{{ tabNav[index] }}
			</view>
		</scroll-view>

		<view v-if="TabCur == 0" class="item">
			<!-- 订单列表 -->
			<!-- 订单列表 -->
			<view v-if="!order.length > 0" class="item-tips"><van-empty description="暂时没有服务" /></view>
			<view class="grad  radius shadow-warp bg-white" v-else v-for="(item, index) in order" :key="index">
				<view class="bg-white item-address-name">
					<view>{{ item.courseName }}</view>
					<view style="color: rgb(150,150,150);">{{ item.statusText }}</view>
				</view>
				<view class="flex flex-wrap item-body">
					<view class="basis-xl  " v-if="item.createtime">
						<text class="cuIcon-title " style="color: #315cdc;"></text>
						<text>{{ item.createtime }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title" style="color: #315cdc;"></text>
						<text>服务人:{{ item.serviceName != '' ? item.serviceName : '无' }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title " style="color: #f27815;"></text>
						<text>手机号:{{ item.servicePhone != '' ? item.servicePhone : '无' }}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="TabCur == 1" class="item">
			<!-- 订单列表 -->
			<!-- 订单列表 -->
			<view v-if="!order.length > 0" class="item-tips"><van-empty description="暂时没有服务" /></view>
			<view class="grad  radius shadow-warp bg-white" v-for="(item, index) in order" :key="index">
				<view class="bg-white item-address-name">
					<view>{{ item.courseName }}</view>
					<!-- 	<view style="color: rgb(150,150,150);">
						{{item.statusText}}
					</view> -->
					<view class="basis-xl-btn" @click="goServiceDetails(item)">立即支付</view>
				</view>
				<view class="flex flex-wrap item-body">
					<view class="basis-xl" v-if="item.createtime">
						<text class="cuIcon-title " style="color: #315cdc;"></text>
						<text>{{ item.createtime }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title" style="color: #315cdc;"></text>
						<text>服务人:{{ item.serviceName != '' ? item.serviceName : '无' }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title " style="color: #f27815;"></text>
						<text>手机号:{{ item.servicePhone != '' ? item.servicePhone : '无' }}</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="TabCur == 2" class="item">
			<!-- 订单列表 -->
			<!-- 订单列表 -->
			<view v-if="!order.length > 0" class="item-tips"><van-empty description="暂时没有服务" /></view>
			<view class="grad  radius shadow-warp bg-white" v-for="(item, index) in order" :key="index">
				<view class="bg-white item-address-name">
					<view>{{ item.courseName }}</view>
					<view style="color: rgb(150,150,150);">{{ item.statusText }}</view>
				</view>
				<view class="flex flex-wrap item-body">
					<view class="basis-xl  " v-if="item.createtime">
						<text class="cuIcon-title " style="color: #315cdc;"></text>
						<text>{{ item.createtime }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title" style="color: #315cdc;"></text>
						<text>服务人:{{ item.serviceName != '' ? item.serviceName : '无' }}</text>
					</view>
					<view class="basis-xl ">
						<text class="cuIcon-title " style="color: #f27815;"></text>
						<text>手机号:{{ item.servicePhone != '' ? item.servicePhone : '无' }}</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="TabCur == 3" class="item">
			<!-- 订单列表 -->
			<!-- 订单列表 -->
			<view v-if="!order.length > 0" class="item-tips"><van-empty description="暂时没有服务" /></view>
			<view class="grad  radius shadow-warp bg-white" v-for="(item, index) in order" :key="index">
				<view class="bg-white item-address-name">
					<view>{{ item.courseName }}</view>
					<view style="color: rgb(150,150,150);">{{ item.statusText }}</view>
				</view>
				<view class="flex flex-wrap item-body">
					<view class="basis-xl  " v-if="item.createtime">
						<text class="cuIcon-title " style="color: #315cdc;"></text>
						<text>{{ item.createtime }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title" style="color: #315cdc;"></text>
						<text>服务人:{{ item.serviceName != '' ? item.serviceName : '无' }}</text>
					</view>
					<view class="basis-xl">
						<text class="cuIcon-title " style="color: #f27815;"></text>
						<text>手机号:{{ item.servicePhone != '' ? item.servicePhone : '无' }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
import uniSection from '@/components/uni-section/uni-section.vue';
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
export default {
	components: {
		uniSection,
		uniSegmentedControl,
		vanEmpty
	},
	data() {
		return {
			CustomBar: this.CustomBar,
			TabCur: 0,
			tabNav: ['全部', '未支付', '服务中', '已完成'],
			current: 0,
			styleType: 'text',
			order: {},
			token: ''
		};
	},
	onLoad(option) {
		if (option.status) {
			this.TabCur = option.status;
		} else {
			this.TabCur = 0;
		}
		this.token = uni.getStorageSync('userList').accessToken;
	},
	onShow() {
		this.orderArray(this.TabCur);
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			if (e.currentTarget.dataset.id == 0) {
				this.orderArray(0);
			} else if (e.currentTarget.dataset.id == 1) {
				this.orderArray(1);
			} else if (e.currentTarget.dataset.id == 2) {
				this.orderArray(6);
			} else if (e.currentTarget.dataset.id == 3) {
				this.orderArray(5);
			}
		},
		/* 查看服务详情 */
		goServiceDetails(item) {
			uni.navigateTo({
				url: 'servicesDetails?orderId=' + item.id
			});
		},
		//查询所有订单
		orderArray(type) {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			let that = this;
			that.$req.request({
				url: 'api/order/getOrderList',
				method: 'get',
				data: {
					pageNo: '1',
					pageSize: '10000',
					type: type
				},
				success: res => {
					if (res.data.code == 200) {
						that.order = [];
						that.order = res.data.data.items;
						for (let i = 0; i < that.order.length; i++) {
							if (that.order[i].status == 1) {
								that.order[i].statusText = '待支付';
							} else if (that.order[i].status == 2) {
								that.order[i].statusText = '已支付';
							} else if (that.order[i].status == 3) {
								that.order[i].statusText = '已取消';
							} else if (that.order[i].status == 4) {
								that.order[i].statusText = '已取消(系统)';
							} else if (that.order[i].status == 5) {
								that.order[i].statusText = '已完成';
							} else if (that.order[i].status == 6) {
								that.order[i].statusText = '服务中';
							}
						}
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
		goOrderDeatil(orderId, status) {
			uni.setStorageSync('orderId', orderId);
			uni.setStorageSync('orderStatus', status);
			uni.navigateTo({
				url: './orderList'
			});
		}
	}
};
</script>

<style>
.cu-item {
	width: 22.2%;
	color: #000000;
}

.cu-item_active {
	border-bottom: 1px solid rgb(59, 145, 8);
	color: rgb(59, 145, 8);
}

.item {
	height: 90vh;
	margin-top: 115upx;
}
.item-tips {
	text-align: center;
	font-size: 37rpx;
	color: rgb(145, 145, 145);
	height: 100%;
}
.option-item {
	width: 700upx;
	margin: 0 auto;
	border-radius: 10upx;
	background-color: #ffffff;
	margin-top: 20upx;
}

.option-central {
	display: flex;
	width: 100%;
	padding: 15upx 0upx 0upx 20upx;
	/* border-bottom: 1px solid #CFCFCF; */
}

.option-central-image image {
	width: 150upx;
	height: 130.5upx;
}

.option-header {
	display: flex;
	justify-content: space-between;
	font-size: 30upx;
	color: #000000;
	border-bottom: 1px solid #d4d4d4;
	padding-top: 15upx;
	padding-bottom: 15upx;
	padding-left: 15upx;
}

.option-central-info {
	width: 530upx;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	padding-left: 20upx;
}

.option-central-info view {
	padding-top: 7upx;
	padding-bottom: 7upx;
}

.option-bottom {
	width: 100%;
	text-align: right;
}

.option-order-no {
	/* border-bottom: 1px solid #CFCFCF; */
	padding: 8upx 0upx;
}

.option-order-status {
	padding-right: 50upx;
	color: #ed1c24;
}

.option-bottom button {
	width: 220upx;
	height: 70upx;
	line-height: 70upx;
	border: 1px solid #ffffff;
	margin-right: 70upx;
	background-color: #ffffff;
	color: #000000;
	margin-bottom: 5upx;
	margin-top: 5upx;
}

.grad {
	width: 90%;
	margin: 0px auto 15upx;
	/* border: 1px solid red; */
}

.item-address-name {
	border-bottom: 1px solid #c8c7cc;
	padding: 15upx 30upx 15upx 30upx;
	font-size: 30upx;
	color: #000000;
	display: flex;
	justify-content: space-between;
}

.item-body {
	padding-left: 28upx;
	line-height: 55upx;
	font-size: 25upx;
	color: #000000;
}

.cuIcon-title,
.cuIcon-time {
	margin-right: 15upx;
}

.line-red {
	padding-left: 31upx;
	line-height: 55upx;
	font-size: 25upx;
}
.basis-xl-btn {
	text-align: center;
	width: 160rpx;
	height: 50rpx;
	line-height: 50rpx;
	border: 1px solid rgb(150, 150, 150);
	color: rgb(150, 150, 150);
	border-radius: 15rpx;
}
</style>
