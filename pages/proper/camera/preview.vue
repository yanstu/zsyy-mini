<template>
	<view title="预览图片">
		<image mode="widthFix" :src="src" class="renlian"></image>
		<view class="btns">
			<button @click="takePhoto" type="default">重拍</button>
			<button @click="usePhoto" type="default">使用照片</button>
		</view>
	</view>
</template>

<script>
import baseurl from '../../../config/request.js';
var log = require('../../../util/log.js');
export default {
	data() {
		return {
			src: '',
			timeId: null,
			remark: '',
			qrId: ''
		};
	},
	onLoad(option) {
		this.src = option.src;
		this.qrId = option.qrId;
		this.remark = option.remark;
		this.name = option.name;
	},
	onHide() {
		clearTimeout(this.timeId);
		this.timeId = null;
	},
	methods: {
		takePhoto() {
			uni.navigateBack({ delta: 1 });
		},
		uploadFileMinipro(tempFilePath, callback) {
			let user = uni.getStorageSync('userList');
			let gpsx = uni.getStorageSync('lot');
			let gpsy = uni.getStorageSync('lat');

			uni.uploadFile({
				url: baseurl + 'api/upload/admin',
				filePath: tempFilePath,
				name: 'file',
				success: res => {
					let timeUrl = res.data;
					this.$req.request({
						url: 'api/form/monitor',
						method: 'get',
						data: {
							phone: user.phone,
							communityId: this.communityId,
							gpsx,
							gpsy,
							qrId: this.qrId,
							remarks: this.remark,
							timeUrl
						},
						success: res => {
							if (res.data.code == 200) {
								uni.navigateTo({
									url: '../inspection?backpage=photograph&qrId=' + this.qrId
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
								uni.reLaunch({
									url: '../photograph'
								});
							}
						},
						complete: data => {
							log.info(data);
						}
					});
				},
				fail: res => {
					log.error(option);
				}
			});
		},
		usePhoto() {
			this.uploadFileMinipro(this.src, this.retoRenzheng);
		},
		retoRenzheng() {
			this.timeId = setTimeout(() => {
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 3]; //上一个页面
				prevPage.fromTu = true;
				uni.navigateBack({ delta: 2 });
			}, 200);
		}
	}
};
</script>
<style>
.renlian {
	width: 100%;
	height: 90vh;
}
.btns {
	display: flex;
	justify-content: center;
}
.btns button {
	flex: 1;
}
</style>
