<!-- 业主信息审核进度 -->
<template>
	<view class="container">
		<view class="box-noinfo" v-if="!checkList.length > 0"><van-empty description="暂时没有提交任何审核信息" /></view>
		<view class="grad radius shadow-warp bg-white" v-for="(item, index) in checkList" :key="index" v-else>
			<view class="bg-white item-address-name">
				<text>
					{{ item.districtName }}
					<text>{{ '(' + item.unitName + ')' }}</text>
				</text>
			</view>
			<view class="flex flex-wrap item-body">
				<view class="basis-xl" v-if="item.name">
					<text class="cuIcon-title" style="color: #315cdc;"></text>
					<text>姓名：{{ item.name }}</text>
				</view>
				<view class="basis-xl  " v-if="item.phone">
					<text class="cuIcon-title " style="color: #f27815;"></text>
					<text>手机号：{{ item.phone }}</text>
				</view>
				<view class="basis-xl  " v-if="item.doorNo">
					<text class="cuIcon-title " style="color: #315cdc;"></text>
					<text>门牌号：{{ item.doorNo }}</text>
				</view>
				<view class="basis-xl " v-if="item.cartNo">
					<text class="cuIcon-title " style="color: #f27815;"></text>
					<text>车牌号：{{ item.cartNo }}</text>
				</view>
				<view class="basis-xl " v-if="item.spaceCartNo">
					<text class="cuIcon-title " style="color: #315cdc;"></text>
					<text>我的停车位：{{ item.spaceCartNo }}</text>
				</view>
				<view class="basis-xl " v-if="item.dateTime">
					<text class="cuIcon-time "></text>
					<text>提交时间：{{ item.dateTime | formatDate }}</text>
				</view>
			</view>
			<view class="line-red">状态:{{ item.status == 0 ? '审核失败(' + item.reason + ')' : item.status == 1 ? '审核中' : '审核通过' }}</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
export default {
	components: {
		vanEmpty
	},
	data() {
		return {
			checkList: [],
			token: null
		};
	},
	onLoad() {
		var res = this.checkLogin('../proper/userInfo/userCheck', '2');
		if (!res) {
			return false;
		}
		this.token = res;
		this.getUserReviewInfo();
	},
	methods: {
		getUserReviewInfo() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.$req.request({
				url: 'api/community/getUserReviewInfo',
				method: 'GET',
				success: res => {
					if (res.data.code == 200) {
						this.checkList = res.data.data;
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
		}
	},
	filters: {
		formatDate: function(value) {
			let date = new Date(value);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? '0' + MM : MM;
			let d = date.getDate();
			d = d < 10 ? '0' + d : d;
			let h = date.getHours();
			h = h < 10 ? '0' + h : h;
			let m = date.getMinutes();
			m = m < 10 ? '0' + m : m;
			let s = date.getSeconds();
			s = s < 10 ? '0' + s : s;
			return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
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
