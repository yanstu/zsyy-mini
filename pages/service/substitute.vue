<template>
	<view>
		<view class="gard">
			<view class="box">
				<view class="box-name"><van-field label="姓名" required placeholder="输入缴费用户姓名" @change="onChange" /></view>
				<view class="box-name"><van-field label="手机号" required placeholder="输入缴费用户手机号" @change="onChange" /></view>
				<view class="money">
					<text>输入金额</text>
					<van-field clearable :value="money" input-class="input-class" label-class="label-class" label="￥" placeholder="请输入缴费金额" />
					<view class="moneybtn">
						<view @tap.stop="fastFill(50)">50元</view>
						<view @tap.stop="fastFill(100)">100元</view>
						<view @tap.stop="fastFill(150)">150元</view>
					</view>
				</view>
			</view>
			<button @click="pay" class="btn">立即缴费</button>
		</view>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import Dialog from '@/wxcomponents/vant/dialog/dialog.js';
import vanField from '@/wxcomponents/vant/field/index';
// #endif
// #ifdef MP-ALIPAY
import Dialog from '@/components/vant/dialog/dialog.js';
import vanField from '@/components/vant/field/index';
// #endif
export default {
	components: {
		vanField
	},
	data() {
		return {
			token: '',
			fee: null,
			money: 0
		};
	},
	onLoad(option) {
		this.token = uni.getStorageSync('userList').accessToken;
	},
	onShow() {
		this.getCommunityFee(uni.getStorageSync('currC').communityFeeId);
	},
	methods: {
		fastFill(num) {
			this.money = num;
		},
		//获取小区物业费
		getCommunityFee(cId) {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/community/getCommunityFee',
				method: 'get',
				data: {
					communityId: parseInt(cId)
				},
				success: res => {
					if (res.data.code == 200) {
						if (!res.data.data[0].feeStatus) {
							this.fee = res.data.data[0];
						} else {
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
		pay() {
			if (this.fee.monthFee == 0) {
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
			this.$req.request({
				url: 'api/order/submitCommunityFeeOrder',
				method: 'get',
				header: {
					accessToken: this.token,
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: {
					communityFeeId: this.fee.id,
					productId: 0
				},
				success: res => {
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
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	color: #fff;
	background-color: #3b9108;
	border-radius: 0;
	border-radius: 35rpx 35rpx 0 0;
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
.money {
	margin: 0 auto;
	display: flex;
	background-color: #ffffff;
	flex-direction: column;
	text-align: left;
	margin-top: 10rpx;
	height: 10.5rem;
	padding: 0 15rpx;
}
.money text {
	margin: 30rpx 0rpx;
	margin-left: 15rpx;
}
.label-class {
	font-weight: bolder;
	font-size: 45rpx;
	color: #000000;
}
.input-class {
	font-weight: bolder;
	font-size: 35rpx;
	color: #000000;
}

.moneybtn {
	margin-top: 40rpx;
	display: flex;
}
.moneybtn view {
	flex: 1;
	width: 31%;
	margin-right: 2%;
	background-color: #f4f4fa;
	color: #000000;
	line-height: 65rpx;
	height: 65rpx;
	text-align: center;
}
.moneybtn view:hover {
	background-color: #00a950;
	color: white;
}
.moneybtn view:last-child {
	margin: 0;
}
</style>
