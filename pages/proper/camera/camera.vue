<template>
	<view title="拍照">
		<camera v-if="openCamera" device-position="front" frame-size="large" class="zipai" @error="error"></camera>
		<button @click="takePhoto" type="default">拍照</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			openCamera: true,
			remark: '',
			qrId: ''
		};
	},
	onLoad(option) {
		this.qrId = option.qrId;
		this.remark = option.remark;
	},
	methods: {
		takePhoto() {
			const ctx = wx.createCameraContext();
			ctx.takePhoto({
				quality: 'normal',
				success: res => {
					let tempFilePath = res.tempImagePath;
					this.openCamera = false;
					wx.navigateTo({
						url: 'preview?src=' + tempFilePath + '&qrId=' + this.qrId + '&remark=' + this.remark
					});
				}
			});
		},
		//用户拒绝授权摄像头
		error(e) {
			this.openCamera = false;
			wx.showModal({
				title: '警告',
				content: '若不授权使用摄像头，将无法使用拍照功能！',
				cancelText: '不授权',
				cancelColor: '#1ba9ba',
				confirmText: '授权',
				confirmColor: '#1ba9ba',
				success: res => {
					if (res.confirm) {
						wx.openSetting({
							success: res => {
								res.authSetting = {
									'scope.camera': true
								};
								this.openCamera = true;
							}
						});
					} else if (res.cancel) {
						wx.showModal({
							title: '授权失败',
							content: '码上到位需要获取你的地理位置，请在设置界面打开相关权限',
							confirmText: '设置',
							success: res => {
								if (res.confirm) {
									_this.isAuth = false;
									wx.openSetting();
								}
							}
						});
						//拒绝打开授权页面
						wx.navigateBack({ delta: 1 });
					}
				}
			});
		}
	}
};
</script>
<style>
.zipai {
	width: 100%;
	height: 90vh;
}
</style>
