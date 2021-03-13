<template>
	<view class="container">
		<view class="box-noinfo" v-if="records.length == 0"><van-empty description="暂无欠费记录" /></view>
		<view v-else class="grad radius shadow-warp bg-white" v-for="(item, index) in records" :key="index" @click="getPayBill(item.parkingCode)">
			<view class="bg-white item-address-name">
				<text>{{ item.parkName }}</text>
			</view>
			<view class="flex flex-wrap item-body">
				<view class="basis-xl">
					<text class="cuIcon-title" style="color: #315cdc;"></text>
					<text>车牌号：{{ item.carNo }}</text>
				</view>
				<view class="basis-xl">
					<text class="cuIcon-time "></text>
					<text>进场时间：{{ item.enterTime | formatDate }}</text>
				</view>
				<view class="basis-xl">
					<text class="cuIcon-time "></text>
					<text>离场时间：{{ item.leaveTime | formatDate }}</text>
				</view>
				<view class="basis-xl">
					<text class="cuIcon-title " style="color: #f27815;"></text>
					<text>停车费用：{{ item.parkingFee }}</text>
				</view>
				<view class="basis-xl">
					<text class="cuIcon-title " style="color: #315cdc;"></text>
					<text>已缴金额：{{ item.paidValue }}</text>
				</view>
				<view class="basis-xl">
					<text class="cuIcon-title " style="color: #f27815;"></text>
					<text>欠费金额：{{ item.arrearValue }}</text>
				</view>
			</view>
			<view class="line-red">补缴状态：{{ item.paybackStatus == 1 ? '已补缴 (' + formatDate(item.paybackTime) + ')' : item.paybackStatus == 0 ? '未补缴' : '已补缴' }}</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
export default {
	components: {
		vanEmpty
	},
	data() {
		return { records: [] };
	},
	onLoad() {
		this.getRecordList();
	},
	methods: {
		getPayBill(value) {
			uni.navigateTo({
				url: 'payDetail?parkingCode=' + value
			});
		},
		formatDate(value) {
			var dtime = Date(value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3'));
			var date = new Date(dtime);
			var date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			return date_value;
		},
		getRecordList() {
			uni.showLoading({
				title: '加载中'
			});
			var ACCESSTOKEN = uni.getStorageSync('userList').accessToken;
			this.$req.request({
				url: 'api/zhtc/tozhtc/v2/getCarArrearageList',
				header: {
					'Content-Type': 'application/json; charset=UTF-8',
					ACCESSTOKEN
				},
				data: {
					carNo: '贵B12345',
					pageNum: 1,
					pageSize: 100
				},
				success: res => {
					if (res.data.recordInList.length != 0) {
						this.records = res.data.recordInList;
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		}
	},
	filters: {
		formatDate: function(value) {
			var dtime = Date(value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3'));
			var date = new Date(dtime);
			var date_value = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			return date_value;
		}
	}
};
</script>

<style>
.container {
	padding-top: 15upx;
}
.box-noinfo {
	text-align: center;
	font-size: 35rpx;
	color: rgb(150, 150, 150);
}
.grad {
	width: 95%;
	margin: 0px auto 15upx;
	/* border: 1px solid red; */
}

.item-address-name {
	border-bottom: 1px solid #c8c7cc;
	padding: 15upx 0px 15upx 30upx;
	font-size: 30upx;
	font-weight: 700;
	color: #000000;
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
</style>
