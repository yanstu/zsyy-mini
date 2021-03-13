<template>
	<view>
		<!-- <view class="cu-bar bg-white solid-bottom"><view class="action">交易明细</view></view> -->
		<!-- 抽屉 -->
		<!-- eng -->
		<view v-if="priceList.length > 0">
			<view v-for="(item1, index) in priceList" :key="index" v-if="item1.status == 5" class="box">
				<view class="box-item">
					<van-image round width="3.3rem" fit="cover" height="3.3rem" :src="'https://kshht.gzmsdw.cn/imge_zsyy/html/productType' + item1.productType + '.png'" />
					<view class="detail">
						<view>{{ item1.productName }}</view>
						<view class="createtime">{{ item1.createtime }}</view>
					</view>
				</view>
				<view class="box-price">
					<!-- <view class="text-blue">{{item1.status==1?'待支付':item1.status==2?'已支付':item1.status==3?'已取消':item1.status==4?'已取消(系统)':'已完成'}}</view> -->
					<view>{{ item1.productType == 4 ? '+' : '-' }}{{ formatMoney2(item1.price) }}</view>
				</view>
			</view>
		</view>
		<view v-else class="box-no"><van-empty description="你还没有任何缴费记录" /></view>
	</view>
</template>

<script>
import { formatMoney } from '../../util/tool.js';
import uniCollapse from '@/components/uni-collapse/uni-collapse.vue';
import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue';
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
import vanImage from '@/wxcomponents/vant/image/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
import vanImage from '@/components/vant/image/index';
// #endif
export default {
	components: {
		uniCollapse,
		uniCollapseItem,
		vanEmpty,
		vanImage
	},
	data() {
		return {
			token: '',
			priceList: ''
		};
	},
	onLoad() {
		var SUID = uni.getStorageSync('userList'); //用户 id,
		this.token = SUID.accessToken;
		this.paylist();
	},
	methods: {
		formatMoney2(val) {
			return formatMoney(val);
		},
		paylist() {
			uni.showLoading({
				title: '',
				mask: true
			});
			this.$req.request({
				url: 'api/order/findFeeOrderList',
				method: 'get',
				data: {
					pageNo: 1,
					pageSize: 1000,
					status: 5
				},
				success: res => {
					if ((res.data.data.items.status = 2)) {
						this.priceList = res.data.data.items;
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
				// success: res => {
				// 	console.log("支付记录:")
				// 	console.log(res)
				// 	if (res.data.data.items.status = 2) {
				// 		this.priceList = res.data.data.items
				// 	}
				// }
			});
		}
	}
};
</script>
<style>
.box {
	border-top: 1px solid rgba(185, 185, 185, 0.3);
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	height: 5rem;
	padding: 20rpx;
}
.box > view {
}

.box-no {
	text-align: center;
	font-size: 40rpx;
	color: rgb(150, 150, 150);
}
.box-item {
	display: flex;
}
.box-item image {
	vertical-align: middle;
}
.detail {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	margin-left: 30rpx;
}
.createtime {
	font-size: 25rpx;
	color: #c0bec0;
}
.box-price {
	display: flex;
	justify-content: center;
	align-items: center;
}
.box-price view {
	font-weight: bold;
	font-size: 35rpx;
}

.list-item {
	margin: 20rpx 0;
	background-color: #ffffff;
	border-radius: 4rpx;
	overflow: hidden;
}

.list-item-hd {
	padding: 30rpx;
	display: flex;
	align-items: center;

	transition: opacity 0.3s;
}

.list-item-hd-show {
	opacity: 0.2;
}

.list-title {
	flex: 1;
}

.list-item-bd {
	height: 0;
	overflow: hidden;
}

.list-item-bd-show {
	height: auto;
}

.option-box {
	opacity: 0;
	position: relative;
	background-color: #ffffff;
	line-height: 1.41176471;
	font-size: 34rpx;

	transform: translateY(-50%);
	transition: 0.3s;
}

.option-box-show {
	opacity: 1;
	transform: translateY(0);
}

.state-arrow-open {
	transform: rotate(180deg);
	transition: transform 0.3s;
}

.option {
	padding: 20rpx 30rpx;
	position: relative;
	display: flex;
	align-items: center;
}

.option:before {
	content: ' ';
	position: absolute;
	left: 30rpx;
	top: 0;
	right: 30rpx;
	height: 1px;
	border-top: 1rpx solid #d8d8d8;
	color: #d8d8d8;
}

.option:first-child:before {
	display: none;
}

.option-text {
	flex: 1;
}
</style>
