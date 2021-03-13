<template>
	<scroll-view class="gard" scroll-y>
		<view class="cu-bar solid-bottom box-head"><text style="margin: auto;font-size: 30rpx;">近30天的开门记录</text></view>
		<view v-if="statusID" v-for="(items, index1) in socard" :key="index1" class="box">
			<view class="box-circle">
				<view class="box-circle-body"></view>
				<view class="box-circle-border" v-if="index1 + 1 != length"></view>
			</view>
			<view class="box-body">
				<view class="box-type">{{ items.type == 1 ? '即时开门' : '二维码开门' }}</view>
				<view class="box-time">{{ items.createtime | formatDate }}</view>
			</view>
		</view>
		<view v-if="!statusID" style="text-align: center; margin-top:50%;"><text class="margin-top">暂无开门记录</text></view>
	</scroll-view>
</template>

<script>
export default {
	data() {
		return {
			socard: null,
			statusID: false,
			length: 0
		};
	},
	//转发
	onShareAppMessage: function() {
		let users = wx.getStorageSync('user');
		if (res.from === 'button') {
		}
		return {
			title: '掌上云游',
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
	onLoad(option) {
		uni.showLoading({
			title: '请稍后',
			mask: true
		});
		var res = this.checkLogin('../proper/controlableDoorList/offlog', '2');
		if (!res) {
			return false;
		}
		this.token = res;
		this.cId = option.cId;
		this.cradLog();
	},
	onShow() {
		uni.hideLoading();
	},
	methods: {
		cradLog() {
			let that = this;
			that.$req.request({
				url: 'api/community/findOpenDoorList',
				method: 'GET',
				data: {
					communityName: '',
					communityId: -1,
					doorId: -1,
					type: -1
				},
				success: res => {
					if (res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.statusID = true;
							this.length = res.data.data.length;
							that.socard = res.data.data;
						} else {
							this.statusID = false;
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
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
			return y + '/' + MM + '/' + d + ' ' + h + ':' + m;
		}
	}
};
</script>

<style>
page {
	display: flex;
	justify-content: center;
	align-items: center;
}
.gard {
	/* border: 1px solid #000000; */
	width: 97%;
	height: 97%;
	margin: 0 auto;
	background-color: #ffffff;
	overflow: hidden;
}
.box-head {
	background-color: rgb(59, 145, 8);
	color: #ffffff;
	margin-bottom: 40rpx;
}

.box {
	display: flex;
	padding-left: 30rpx;
	padding-right: 25rpx;
}
.box-circle {
	width: 10%;
	height: 100rpx;
	display: flex;
	flex-direction: column;
	position: relative;
}

.box-body {
	width: 90%;
	display: flex;
	justify-content: space-between;
	font-size: 32rpx;
}

.box-circle-body {
	width: 25rpx;
	height: 25rpx;
	background-color: rgb(159, 203, 163);
	border-radius: 50%;
}

.box-circle-border {
	border-left: 2px solid rgb(159, 203, 163);
	height: 75rpx;
	position: absolute;
	top: 25rpx;
	left: 11rpx;
}

.box-type {
}

.box-time {
}
</style>
