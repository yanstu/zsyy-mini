<!-- 人脸信息录入 -->
<template>
	<view class="father">
		<view>
			<view class="uni-common-mt">
				<view class="img">
					<block v-if="imgUrl"><image @click="pause" :src="imgUrl" class="image"></image></block>
					<block v-else><view class="uni-hello-addfile" @click="pause">+ 选择图片</view></block>
				</view>
			</view>
		</view>
		<view class="face">
			<button :class="!isFace || 'bg-gray'" @click="faceAuth">{{ isFace ? '已认证' : '开始认证' }}</button>
			{{ isFace ? '点击图片可重新上传认证' : '请点击“开始认证”按钮进行验证' }}
		</view>
	</view>
</template>
<script>
import baseurl from '../../../config/request.js';
export default {
	data() {
		return {
			imgUrl: '',
			cId: null,
			isFace: false
		};
	},
	onLoad(option) {
		this.cId = uni.getStorageSync('currC').communityId;
		this.getFaceInfo();
	},
	methods: {
		/* 查询用户人脸认证情况 */
		getFaceInfo() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.$req.request({
				url: 'api/community/getUserFaceInfo/' + this.cId,
				method: 'GET',
				success: res => {
					if (res.data.data) {
						this.imgUrl = res.data.data;
						this.isFace = true;
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		/* 上传图片 */
		pause() {
			/* 请求相机权限 */
			uni.authorize({
				scope: 'scope.camera',
				success: res => {
					/* 调用相机 */
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						success: res => {
							let url = res.tempFilePaths;
							uni.showLoading({
								title: '上传中...',
								mask: true
							});
							/* 上传图片 */
							uni.uploadFile({
								url: baseurl + 'api/upload/admin',
								filePath: url[0],
								name: 'file',
								success: res => {
									this.imgUrl = res.data;
									this.isFace = false;
									uni.hideLoading();
								}
							});
						}
					});
				},
				fail: err => {
					uni.showModal({
						title: '授权失败',
						content: '码上到位需要从您的相册获取图片，请在设置界面打开相关权限',
						confirmText: '设置',
						success: res => {
							if (res.confirm) {
								uni.openSetting();
							}
						}
					});
				}
			});
		},
		/* 人脸认证 */
		faceAuth() {
			uni.showLoading({
				title: '认证中',
				mask: false
			});
			this.$req.request({
				url: 'api/community/addFace',
				method: 'get',
				data: {
					communityId: this.cId,
					url: this.imgUrl
				},
				success: res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '认证成功',
							icon: 'none'
						});
						this.isFace = true;
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				fail: res=>{
					console.log(res);
				},
				complete: res => {
					uni.hideLoading();
				}
			});
		}
	}
};
</script>

<style>
.father {
	position: absolute;
	height: 100%;
	width: 750rpx;
	padding-top: 50upx;
}

.img {
	width: 500upx;
	margin: 0px auto;
	height: 500upx;
	background-color: #fff;
}

.bg-gray {
	background: #808080 !important;
}

.uni-hello-addfile {
	text-align: center;
	line-height: 400rpx;
	background: #fff;
	padding: 50rpx;
	margin-top: 10px;
	font-size: 38rpx;
	color: #808080;
}

.image {
	width: 100%;
	height: 100%;
}

.face {
	width: 450rpx;
	margin: 0px auto;
	text-align: center;
	font-size: 30rpx;
	font-weight: 700;
	color: #a7a7a7;
	margin-top: 150upx;
}

.face button {
	background-color: #315cdc;
	color: #ffffff;
	font-size: 40rpx;
	margin-bottom: 50rpx;
}
</style>
