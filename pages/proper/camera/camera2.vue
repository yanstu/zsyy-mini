<template>
	<view class="camera_box">
		<camera class="camera" v-if="!show" device-position="back" flash="off" @error="error">
			<cover-view class="id_m"><!-- <cover-view class="tips_txt">tips</cover-view> --></cover-view>
		</camera>
		<image class="camera_img" :src="src" v-if="show"></image>
		<view class="action">
			<button class="takeBtn" type="primary" @tap="takePhoto" v-if="!show"></button>
			<button class="saveImg" type="primary" @tap="saveImg" v-if="show"></button>
			<button class="cancelBtn" v-if="show" type="primary" @tap="cancelBtn"></button>
		</view>
	</view>
</template>

<script>
import baseurl from '../../../config/request.js';
export default {
	data() {
		return {
			src: '',
			show: false,
			frontShow: false,
			frontSrc: ''
		};
	},
	onShareAppMessage: function() {},
	methods: {
		setData(obj) {
			let that = this;
			let keys = [];
			let val, data;
			Object.keys(obj).forEach(function(key) {
				keys = key.split('.');
				val = obj[key];
				data = that.$data;
				keys.forEach(function(key2, index) {
					if (index + 1 == keys.length) {
						that.$set(data, key2, val);
					} else {
						if (!data[key2]) {
							that.$set(data, key2, {});
						}
					}
					data = data[key2];
				});
			});
		},
		cancelBtn() {
			this.setData({
				show: false
			});
		},
		takePhoto() {
			const ctx = uni.createCameraContext();
			const listener = ctx.onCameraFrame(frame => {});

			ctx.takePhoto({
				quality: 'normal',
				success: res => {
					this.setData({
						src: res.tempImagePath,
						show: true
					});
				},
				fail: error => {}
			});
		},
		async saveImg() {
			let pages = getCurrentPages();
			var currentPage = '';
			var prevPage = '';
			if (pages.length >= 2) {
				currentPage = pages[pages.length - 1];
				prevPage = pages[pages.length - 2];
			}
			const ret = await this.upload();
			this.src = ret;
			if (prevPage) {
				prevPage.$vm.form.url = this.src;
				prevPage.$vm.frontShow = false;
				/*prevPage.setData({
					frontShow: false,
					frontSrc: this.src
				});*/
			}
			uni.navigateBack({
				delta: 1
			});
		},
		upload() {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: baseurl + 'api/upload/admin',
					filePath: this.src,
					name: 'file',
					success: res => {
						resolve(res.data);
					},
					fail: res => {
						console.log(res);
					}
				});
			});
		}
	}
};
</script>
<style>
.camera_box {
	height: 100vh;
	width: 100vw;
	position: relative;
}
.camera {
	height: 85vh;
	width: 100vw;
	z-index: 1;
}
.id_m {
	height: 85vh;
	width: 100vw;
	z-index: 999;
	background: rgba(0, 0, 0, 0.1);
	display: flex;
	position: absolute;
}
.id_m .img {
	width: 550rpx;
	height: 900rpx;
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	margin: auto auto;
	top: 0;
	bottom: 0;
}
.id_m .tips_txt {
	transform: rotate(90deg);
}
.camera_box .action {
	height: 15vh;
	position: relative;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.camera_box .takeBtn {
	height: 120rpx;
	width: 120rpx;
	border-radius: 50%;
	font-size: 24rpx;
	background: url('https://cdn.ctoku.com/1123123123123e3241.png') no-repeat center;
	background-size: contain;
	border: none;
}
.camera_box .cancelBtn {
	font-size: 24rpx;
	height: 120rpx;
	width: 120rpx;
	border-radius: 50%;
	background: url('https://cdn.ctoku.com/12311123342312231.png') no-repeat center;
	background-size: contain;
	border: none;
}
.camera_box .saveImg {
	background: url('https://cdn.ctoku.com/1232123434231231231.png') no-repeat center;
	font-size: 24rpx;
	height: 120rpx;
	width: 120rpx;
	border-radius: 50%;
	background-size: contain;
	border: none;
}
.camera_box .takeBtn::after {
	border: none;
}

.camera_img {
	height: 85vh;
	width: 100%;
}
.id_m .tips_txt {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%) rotate(90deg);
	width: 542rpx;
	height: 35rpx;
	font-size: 34rpx;
	color: #ea952f;
	font-weight: 500;
}
</style>
