<template>
	<view class="Index_index__3M-Z2 h-100">
		<view class="Index_topBg__2YEIj">
			<p class="Index_openTittle__2yMLI">开通无感支付·享受快捷出场</p>
			<p class="Index_pleaseSelect__Y8uxT">无感支付服务须知 &gt;&gt;</p>
		</view>
		<view class="Index_listDiv__35yiT">
			<view class="item">
				<view style="height: 100rpx;" class="item-g">
					<view style="line-height: 35rpx;height: 35rpx;">
						<image mode="aspectFit" style="width: 55rpx;height: 28rpx;vertical-align: middle;margin-right: 30rpx;" src="https://kshht.gzmsdw.cn/imge_zsyy/html/银联.png"></image>
						银联无感支付
					</view>
					<view class="">
						<text style="font-size: 26rpx;" class="text-blue margin-right">去开通</text>
						<text class="cuIcon-right text-gray"></text>
					</view>
				</view>
				<van-divider></van-divider>
				<view class="item-g">
					<view class="text-gray" style="font-size: 25rpx;">查看支持停车场</view>
					<view class=""><text class="cuIcon-right text-gray"></text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanDivider from '@/wxcomponents/vant/divider/index';
// #endif
// #ifdef MP-ALIPAY
import vanDivider from '@/components/vant/divider/index';
// #endif
export default {
	components: {
		vanDivider
	},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
.Index_index__3M-Z2 {
	width: 100%;
	height: 100%;
	background-color: #fbfbfb;
}
.Index_index__3M-Z2 .Index_hideDiv__2VQB4 {
	display: none;
}
.Index_index__3M-Z2 .Index_topBg__2YEIj {
	height: 250rpx;
	width: 100%;
	background: url(https://www.jslife.com.cn/jtc-h5/car-mgmt/static/media/img-auto-payment-home-page-top-bg.b3834da0.png) no-repeat;
	background-size: 100%;
	padding-top: 40rpx;
	/* #ifdef MP-ALIPAY */
	padding-top: 0rpx;
	/* #endif */
}
.Index_index__3M-Z2 .Index_topBg__2YEIj .Index_openTittle__2yMLI {
	font-size: 32rpx;
	color: #fff;
	letter-spacing: 2.8px;
	text-align: center;
	margin: 0;
	padding: 0.86rem 0 0;
}
.Index_index__3M-Z2 .Index_topBg__2YEIj .Index_pleaseSelect__Y8uxT {
	font-size: 27rpx;
	color: #fff;
	letter-spacing: 0;
	text-align: center;
	margin-top: 30rpx;
}
.Index_index__3M-Z2 .Index_coverDiv__2Xq6P {
	height: 100%;
	width: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: absolute;
	top: 0;
}
.Index_index__3M-Z2 .Index_coverDiv__2Xq6P .Index_bottomDiv__vSBP1 {
	position: absolute;
	bottom: 0;
	width: 100%;
	background: #fff;
}
.Index_index__3M-Z2 .Index_coverDiv__2Xq6P .Index_bottomDiv__vSBP1 .Index_sheetList__UD9Gq {
	font-size: 0.28rem;
	height: 4rem;
	line-height: 4rem;
	text-align: center;
	border-bottom: 1px solid #f8f8f8;
}
.Index_index__3M-Z2 .Index_coverDiv__2Xq6P .Index_bottomDiv__vSBP1 .Index_marginDiv__1OTg_ {
	height: 2rem;
	background: #f8f8f8;
}
.Index_index__3M-Z2 .Index_coverDiv__2Xq6P .Index_bottomDiv__vSBP1 .Index_cancelTxt__2AhkR {
	font-family: PingFangSC-Regular;
	font-size: 0.32rem;
	color: #aeaeb7;
	text-align: center;
	height: 4rem;
	line-height: 4rem;
	background: #fff;
}
.Index_index__3M-Z2 .Index_listDiv__35yiT {
	margin-top: -1.16rem;
	margin-bottom: 3.6rem;
	/* #ifdef MP-ALIPAY */
	margin-top: -0.8rem;
	/* #endif */
}
.item {
	height: 200rpx;
	width: 88%;
	margin: 0 auto;
	background: #fff;
	box-shadow: 0 6px 14px 0 rgba(82, 83, 92, 0.06);
	border-radius: 6px;
	padding: 25rpx;
}
.item-g {
	display: flex;
	flex-direction: row;
	padding-top: 20rpx;
}
.item-g > view {
	flex: 1;
}
.item-g view:nth-of-type(2) {
	text-align: right;
}
</style>
