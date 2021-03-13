<template>
	<view>
		<uni-list class="uList"><uni-list-item title="我的小区" :rightText="list.communityName" /></uni-list>
		<uni-list class="uList"><uni-list-item title="我的停车位" :rightText="list.carLicenseNumber" /></uni-list>
		<uni-list class="uList"><uni-list-item class="uniListItem" @click="iproper()" title="停车位缴费" /></uni-list>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					carLicenseNumber: '',
					communityName: '',
					id: '',
					communityId: '',
					parkId: ''
				}
			]
		};
	},
	onShow() {
		this.myproper();
	},
	methods: {
		/* 获取物业信息 */
		iproper() {
			uni.navigateTo({
				url: '/pages/proper/userInfo/stoppay?carLicenseNumber=' + this.list.carLicenseNumber,
				fail(res) {
					console.log(res);
				}
			});
		},
		myproper() {
			let that = this;
			const userInfo = uni.getStorageSync('userList'); //获取userList
			const token = userInfo.accessToken; //获取token
			var communityId = uni.getStorageSync('currC').communityId;
			that.$req.request({
				url: 'api/community/getMyCommunity',
				method: 'get',
				data: {
					communityId,
					status: -1
				},
				success: res => {
					that.list = res.data.data[0];
				},
				complete: data => {}
			});
		}
	}
};
</script>

<style>
/* 底部栏 */
.action-section {
	position: fixed;
	margin-bottom: 0upx;
	/* #ifdef H5 */
	margin-bottom: 0upx;
	/* #endif */
	bottom: 0upx;
	z-index: 95;
	display: flex;
	align-items: center;
	width: 750upx;
	height: 120upx;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	background: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
}
</style>
