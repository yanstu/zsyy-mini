<template>
	<view>
		<view class="gard" v-if="!show">
			<view v-for="(item, index) in fee" :key="item" class="box">
				<view class="box-name">
					<view>小区名称：</view>
					<view>{{ item.communityName }}</view>
				</view>
				<view class="box-name">
					<view>所欠金额：</view>
					<view class="text-red">{{ item.monthFee / 100 + '元' }}</view>
				</view>
				<button @click="pay(item)" class="btn">立即缴费</button>
			</view>
		</view>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanDialog from '@/wxcomponents/vant/dialog/index';
import Dialog from '@/wxcomponents/vant/dialog/dialog.js';
// #endif
// #ifdef MP-ALIPAY
import vanDialog from '@/components/vant/dialog/index';
import Dialog from '@/components/vant/dialog/dialog.js';
// #endif
export default {
	components: {
		vanDialog
	},
	data() {
		return {
			fee: [],
			xiaoqu: null,
			unit: null
		};
	},
	onShow() {
		this.xiaoqu = uni.getStorageSync('currC');
		this.unit = uni.getStorageSync('currU');
		this.getCommunityFee();
	},
	methods: {
		//获取小区物业费
		getCommunityFee() {
			this.fee = [];
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/community/getCommunityFee',
				method: 'get',
				data: {
					communityId: this.xiaoqu.communityId
				},
				success: res => {
					if (res.data.code == 200) {
						for (let s of res.data.data) {
							if (!s.feeStatus) {
								this.fee.push(s);
							}
						}
						if (this.fee.length == 0) {
							this.show = true;
						}
					} else {
						uni.showToast({
							title: res.data.msg
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		pay(item) {
			if (item.monthFee == 0) {
				Dialog.alert({
					title: '提示',
					message: '并无欠费记录，无需缴费。',
					theme: 'round-button'
				}).then(() => {});
				return;
			}
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			var accessToken = uni.getStorageSync('userList').accessToken;
			this.$req.request({
				url: 'api/order/submitCommunityFeeOrder',
				header: {
					accessToken,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					communityFeeId: item.id,
					productId: 0
				},
				success: res => {
					console.log(1);
					if (res.data.code == 200) {
						uni.navigateTo({
							url: '../../pay/pay?orderNo=' + res.data.data.orderNo + '&actualPrice=' + res.data.data.actualPrice / 100
						});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
					uni.hideLoading();
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
.gard {
	/* border: 2px solid #000000; */
	width: 100%;
}
.btn {
	color: #fff;
	background: linear-gradient(to right, #ff8600, #ff5e00);
	border-radius: 0;
	border-radius: 50rpx;
	width: 50%;
	margin: 0 auto;
	margin-top: 50rpx;
}
.input {
	color: #959595;
	border-bottom: 1px solid #cccccc;
}
.box-name {
	display: flex;
	justify-content: space-between;
	padding: 23rpx 13rpx;
	background-color: #ffffff;
	margin-top: 10rpx;
}
</style>
