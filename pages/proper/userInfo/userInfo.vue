<template>
	<view>
		<view class="box-no" v-if="!priceList.length > 0"><van-empty description="该小区还没有添加门禁设备" /></view>
		<view v-else :key="index" v-for="(item1, index) in priceList" @click="submit(item1)" @longpress="deleteShow(item.id)">
			<view class="basis-xl margin-xs padding-sm">
				<view class="bg-gradual-blue padding shadow-blur container">
					<view class="cu-capsule round">{{ item1.deviceName }}</view>
					<view>
						<text class="cuIcon-vipcard textright"><text style="margin-left: 10px;">立即开门</text></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanEmpty from '@/wxcomponents/vant/empty/index';
// #endif
// #ifdef MP-ALIPAY
import vanEmpty from '@/components/vant/empty/index';
// #endif
export default {
	components: {
		vanEmpty
	},
	data() {
		return {
			priceList: [],
			statusID: false,
			cId: ''
		};
	},
	onLoad(option) {
		this.cId = uni.getStorageSync('currC').communityId;
	},
	onShow() {
		this.getDoorList();
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
			return y + '-' + MM + '-' + d + '' + h + ':' + m + ':' + s;
		}
	},
	methods: {
		tolog() {
			uni.navigateTo({
				url: '../controlableDoorList/offlog'
			});
		},
		submit(item) {
			uni.navigateTo({
				// url:"/pagesB/user/info/vehicleBinding/vehicleBinding?item="+encodeURIComponent(JSON.stringify(item)),
				url: `/pages/proper/controlableDoorList/controlableDoorList?id=${item.doorId}`,
				fail(res) {}
			});
		},
		getDoorList() {
			this.$req.request({
				url: 'api/community/getUserCommunityDoorList',
				method: 'get',
				data: {
					communityId: this.cId
				},
				success: res => {
					if (res.data.code == 200) {
						this.statusID = true;
						this.priceList = res.data.data;
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
.button button {
	width: 100%;
	line-height: 39px;
	box-shadow: 1px 2px 5px rgba(241, 69, 106, 0.4);
	background-image: linear-gradient(45deg, rgb(120, 163, 228), rgb(228, 187, 184));
	border-radius: 20px;
	height: 39px;
	text-align: center;
}
.box-no {
	font-size: 40rpx;
	color: rgb(150, 150, 150);
	text-align: center;
}
.textright {
	margin-left: 30%;
}
.container {
	display: flex;
}
.container > view {
	flex: 1;
}
.container > view:nth-of-type(2) {
	text-align: right;
}
</style>
