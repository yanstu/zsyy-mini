<template>
	<view class="container">
		<view class="bg-gradual-blue radius" style="width: 95%; margin: auto;">
			<view class="flex justify-between">
				<view class="padding-sm margin-xs radius">{{ status }}</view>
				<view class="padding-sm margin-xs radius">
					<text class="cuIcon-barcode"></text>
					{{ code }}
				</view>
			</view>
			<view class="flex justify-between">
				<view class="padding-sm radius">订单号：</view>
				<view class="padding-sm radius">{{ list.orderNo }}</view>
			</view>
			<view class="flex justify-between">
				<view class="padding-sm radius">金额：{{ list.actualPrice / 100 }}</view>
				<view class="padding-sm radius"><text class="cu-btn bg-green shadow" @click="submit">支付</text></view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			pid: '',
			code: '',
			token: '',
			status: '',
			list: ''
		};
	},
	onShow() {},
	onLoad(option) {
		var res = this.checkLogin('../user/userService/serviceList', '2');
		if (!res) {
			return false;
		}
		this.token = res;
		this.code = option.montID;
		this.status = option.statusID;
		this.pid = uni.getStorageSync('PNDID');
		this.getOrderList();
	},
	methods: {
		submit() {
			uni.navigateTo({
				url: '../../pay/pay?actualPrice=' + this.list.actualPrice / 100 + '&orderNo=' + this.list.orderNo + '&type=1'
				// url: `../myMonth/mycmcc/mycmcc?montID=${item.monthTicketConfigId}`,
			});
		},
		/* 查询服务 */
		getOrderList() {
			this.$req.request({
				url: 'api/ticket/submitMonthTicketOrder?monthTicketConfigId=' + this.code + '&carId=' + this.pid,
				method: 'get',
				// data:{
				// 	"monthTicketConfigId":this.code,
				// 	"carId":this.pid
				// },
				success: res => {
					this.list = res.data.data;
					if (res.data.code == 200) {
					} else {
						uni.showToast({
							title: '哦吼服务器断线了~',
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
.container {
	background-color: #e7e7e7;
	height: 100%;
	padding-top: 30rpx;
}
.grad {
	width: 90%;
	/* border: 1px solid red; */
	margin: 0rpx auto 30rpx;
	padding: 25rpx;
	background-color: #f4f4f4;
}
.item-plate {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
}

.item-license-plate {
	width: 30%;
	text-decoration: underline;
	color: #007aff;
}
.item {
	margin-bottom: 15rpx;
	color: #000000;
}
.title {
	font-size: 29rpx;
	color: #000000;
	font-weight: 700;
}
.status {
	font-size: 29rpx;
	color: #969696;
	font-weight: 700;
}
.item-text {
	margin-left: 8rpx;
}
</style>
