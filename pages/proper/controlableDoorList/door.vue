<template>
	<view class="content">
		<!-- <view class="canvas"><canvas canvas-id="qrcode" :style="{ width: `${qrcodeSize}px`, height: `${qrcodeSize}px` }" /></view> -->
		<view class="canvas"><image style="width: 300rpx;height: 300rpx;" src="https://kshht.gzmsdw.cn/imge_zsyy/html/logo.png" mode=""></image></view>
		<view class="cu-form-group margin-top">
			<text>可开门次数：{{ num.num }}</text>
		</view>
		<view class=" margin-top">
			<text>有效时间：</text>
			<!-- {{ num.startTime | formatDate }}/n{{ num.endTime | formatDate }} -->
			<text>{{ time }}</text>
		</view>
		<view class=" margin-top">
			<text style="font-size: 25rpx;text-indent: 2em;">使用说明：分享给他人后，点进即开锁，他人可再次将剩余开门次数分享给其他人。</text>
		</view>
		<view class="cu-form-group margin-top">
			<button class="title" open-type="share">
				分享给朋友
				<text class="cuIcon-share  text-orange"></text>
			</button>
		</view>
		<!-- <button class="button" style="background-image: linear-gradient(45deg,rgb(252, 169, 227),rgb(120, 163, 228);" type="primary" @tap="make()">生成二维码</button> -->
	</view>
</template>

<script>
var log = require('../../../util/log.js');
export default {
	onShareAppMessage() {
		return {
			title: '访客预约开门',
			//desc: '分享页面的内容',
			path: 'pages/proper/controlableDoorList/door?type=1&openParam=' + this.openParam + '&item=' + uni.getStorageSync('item')
		};
	},
	data() {
		return {
			qrcodeText: '',
			qrcodeSize: 160,
			qrcodeSrc: null,
			num: '5',
			type: 0,
			openParam: '',
			time: '',
			timer: null,
			id: 0
		};
	},
	beforeDestroy() {
		clearInterval(this.timer);
		this.timer = null;
	},
	async onShow() {
		if (!uni.getStorageSync('userList')) {
			uni.navigateTo({
				url: '../../register/wxlogin'
			});
			return;
		}
		if (uni.getStorageSync('openParam') == '') {
			var ret = await this.getCommunityCodeOpenDoorParam();
			this.openParam = ret;
			//this.make(ret);
			var ret2 = await this.doorsziz(this.openParam);
			this.num = ret2;
			//this.doorarray(ret2);
		} else {
			//this.make(this.openParam);
			var ret = await this.doorsziz(uni.getStorageSync('openParam'));
			this.num = ret;
			this.doorarray(uni.getStorageSync('openParam'));
		}
		this.timer = setInterval(() => {
			this.showtime(this.formatDate(this.num.endTime));
		}, 1000);
	},
	onLoad(options) {
		uni.setStorageSync('item', options.item);
		uni.setStorageSync('type', options.type);
		uni.setStorageSync('openParam', options.openParam);
	},
	methods: {
		getCommunityCodeOpenDoorParam() {
			var doorId = uni.getStorageSync('item');
			return new Promise((resolve, reject) => {
				this.$req.request({
					url: 'api/community/getCommunityCodeOpenDoorParam',
					method: 'get',
					data: {
						doorId
					},
					success: res => {
						resolve(res.data.data);
					},
					complete: data => {}
				});
			});
		},
		formatDate(value) {
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
		},
		showtime(endTime) {
			var nowtime = new Date(),
				endtime = new Date(endTime);
			var lefttime = endtime.getTime() - nowtime.getTime(),
				leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)),
				lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24),
				leftm = Math.floor((lefttime / (1000 * 60)) % 60),
				lefts = Math.floor((lefttime / 1000) % 60);
			this.time = leftd + '天' + lefth + '小时' + leftm + '分' + lefts + '秒';
		},
		//二维码开门
		doorarray(data) {
			var doorId = uni.getStorageSync('item');
			this.$req.request({
				url: 'api/community/communityCodeOpenDoor',
				method: 'get',
				data: {
					doorId,
					openParam: data
				},
				success: res => {
					uni.removeStorageSync('openParam');
					uni.removeStorageSync('item');
					uni.removeStorageSync('type');
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: '开门成功',
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		},
		//获取剩余开门次数参数
		doorsziz(data) {
			var doorId = uni.getStorageSync('item');
			return new Promise((resolve, reject) => {
				this.$req.request({
					url: 'api/community/getCommunityCodeOpenDoorDetail',
					method: 'get',
					data: {
						doorId,
						openParam: data
					},
					success: res => {
						resolve(res.data.data);
					},
					complete: data => {}
				});
			});
		}
	}
};
</script>

<style>
page {
	background-color: #ffffff;
}

.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	/*margin-top: 0rpx; var(--status-bar-height)*/
}

.text {
	display: flex;
	justify-content: center;
	font-size: 36rpx;
	color: #666666;
}

.canvas {
	margin-top: 5rpx;
	text-align: center;
}

.canvas canvas {
	margin: 0 auto;
}

.image {
	width: 258rpx;
	margin-top: 50rpx;
	text-align: center;
}

.image image {
	display: block;
	width: 258rpx;
	height: 258rpx;
}

.input {
	width: 600rpx;
	height: 40px;
	margin: 50rpx 0;
	padding: 0 20rpx;
	border-radius: 5px;
	background-color: #ffffff;
	box-sizing: border-box;
}

.button {
	width: 690rpx;
	margin: 10rpx;
}
.button:last-child {
	margin-bottom: 50rpx;
}
</style>
