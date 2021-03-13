<!-- 二维码开锁 还没开锁成功 -->
<template>
	<view class="view0">
		<view class="view1">
			<view class="view2">
				<view class="view3">
					<view class="view4">
						<view class="view5"><image :src="imgon" @click="offsuo" class="image"></image></view>
					</view>
				</view>
			</view>
			<view class="title-1">
				<view>{{ tt ? '已开锁，请下压把手' : '未开锁，点击图标解锁开门' }}</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			imgon: 'https://kshht.gzmsdw.cn/imge_zsyy/html/suo.png',
			imgoff: 'https://kshht.gzmsdw.cn/imge_zsyy/html/off.png',
			// status:'200',
			id: '',
			tt: false
		};
	},
	onLoad(options) {
		var res = this.checkLogin('../proper/unlock/unlock', '2');
		if (!res) {
			return false;
		}
		this.token = res;
		this.id = options.item;
	},
	methods: {
		offsuo() {
			if (this.tt) return;
			
			uni.showLoading({
				title: '开锁中'
			});
			let that = this;
			that.$req.request({
				url: 'api/community/communityOpenDoor',
				method: 'GET',
				data: {
					doorId: this.id
				},
				success: res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						uni.showToast({
							title: '已开门',
							icon: 'success'
						});
						this.tt = true;
						this.imgon = this.imgoff;
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
	}
};
</script>
<style>
.view0 {
	height: 1200upx;
	position: absolute;
	width: 750upx;
}

.view1 {
	position: relative;
	top: 120px;
	width: 430rpx;
	height: 430rpx;
	border: 1px solid rgb(93, 163, 52);
	margin: auto;
	border-radius: 50%;
	padding: 5rpx;
}

.view2 {
	border: 5px solid rgb(156, 196, 133);
	height: 95%;
	width: 95%;
	border-radius: 50%;
	margin: 5rpx;
}

.view3 {
	border: 5px solid rgb(59, 145, 8);
	height: 95%;
	width: 95%;
	border-radius: 50%;
}

.view4 {
	border: 5px solid rgb(156, 196, 133);
	height: 95%;
	width: 95%;
	border-radius: 50%;
}

.view5 {
	height: 100%;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.image {
	width: 60px;
	height: 60px;
}
.title-1 {
	margin-top: 50px;
}
.title-1 view {
	text-align: center;
	color: red;
}
</style>
