<template>
	<view class="gard">
		<view
			class="cu-bar bg-white solid-bottom margin-top"
			style="border-top-left-radius: 10px;
	border-top-right-radius: 10px;background-color:#8bb7f9;"
		>
			<text style="margin: auto;font-size: 30rpx;">近30天的缴费记录</text>
		</view>
		<view v-for="(items, index1) in taskList" :key="index1">
			<view class="cu-timeline">
				<view class="cu-time" style="width:100px;">{{ items.data }}</view>
				<view class="cu-item text-blue">
					<view class="bg-blue content">
						<text>{{ items.time }}</text>
						<text style="margin-left: 20px;">{{ items.text }}</text>
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
			taskList: [
				{
					data: '2008-12-31',
					time: '12:30:45',
					text: '---停车'
				},
				{
					data: '2008-12-31',
					time: '12:30:45',
					text: '购买套餐'
				},
				{
					data: '2008-12-31',
					time: '12:30:45',
					text: '物业缴费'
				}
			]
		};
	},
	//转发
	onShareAppMessage: function() {
		let users = wx.getStorageSync('user');
		if (res.from === 'button') {
		}
		return {
			title: '码上到位',
			path: '/pages/proper/door',
			imageUrl: '', //这个是显示的图片，不写就默认当前页面的截图
			success: function(shareTickets) {
				console.info(shareTickets + '成功');
				// 转发成功
			},
			fail: function(res) {
				console.log(res + '失败');
				// 转发失败
			},
			complete: function(res) {
				// 不管成功失败都会执行
			}
		};
	},
	methods: {}
};
</script>

<style>
.gard {
	/* border: 1px solid #000000; */
	width: 90%;
	margin-left: 5%;
	box-shadow: 0rpx 20rpx 10rpx 0rpx #92c7bf;
}
</style>
