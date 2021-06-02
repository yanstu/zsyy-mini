<!-- 停车场包月 -->
<template>
	<view class="content">
			<view class="cu-form-group">
				<view class="title">停车场信息:</view>
				<input placeholder="请填写你的小区名称" type="text" name="communityName" :value="communityName"/>
			</view>
			<view class="cu-form-group">
				<view class="title">剩余空位:</view>
				<input placeholder="" name="residualVacancies" :value="residualVacancies"/>
			</view>
			<view class="cu-form-group">
				<view class="title">资费:</view>
				<input name="money" :value="money" style="color: red;"/>
			</view>
			<button type="primary" class="buttou" @click="payment">立即缴费</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				residualVacancies:0,
				money:0,
				communityName:""
			}
		},
		methods: {
			payment(){
				uni.request({
					url: '',
					method: 'GET',
					data: {},
					success: res => {
						uni.navigateTo({
							url:"../pay/pay"
						})
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.content{
		position: relative;
	}
	.buttou{
		position: absolute;
		bottom: 0px;
		left: 0px;
		right: 0px;
		display: block;
	}
	.cu-form-group view{
		width: 200upx;
	}
</style>
