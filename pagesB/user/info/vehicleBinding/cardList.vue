<template>
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action"><text style="color: black;" class="text-blue">我的车牌列表</text></view>
			<button class="cu-btn cuIcon" @click="addCard" style="margin-right: 20px;"><text class="cuIcon-add"></text></button>
		</view>
		<!-- <view class="button margin-top"><button type="primary" size="mini" @click="submit">添加车牌<text class="cuIcon-add radius"></text></button></view> -->
		<view class="margin-top"></view>
		<view class="card-no" v-if="!priceList.length > 0"></view>
		<view v-if="statusID" class="solid-bottom bg-white" v-for="(item1, index) in priceList" @tap="deleteShow(item1)" :key="index">
			<view class="flex solid-bottom justify-between">
				<view class="padding-sm margin-xs">
					<view>
						<view>
							<view class="cu-capsule round">{{ item1.carLicenseNumber }}</view>
						</view>
					</view>
				</view>
				<view class="box-icon"><view class="cuIcon-edit" @click.stop="submit(item1)"></view></view>
			</view>
		</view>
		<view v-if="!statusID" style="text-align: center; margin-top:50%;">
			<view><image src="https://kshht.gzmsdw.cn/imge_zsyy/html/services/xieche.png" style="width: 80rpx; height: 80rpx;"></image></view>
			<text style="color: black;" class="cuIcon-activity text-cyan margin-top">你还没有添加车牌哦~</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusID: false,
			backpage: '',
			priceList: [],
			type: 0 //0代表不需要选择
		};
	},
	onLoad(option) {
		if (option.type) {
			this.type = option.type;
		}
		var res = this.checkLogin('../user/info/vehicleBinding/cardList', '2');
		if (!res) {
			return false;
		}
		this.token = res;
		this.backpage = option.backpage;
	},
	onShow() {
		this.cardArray();
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
		submit(item) {
			uni.navigateTo({
				url: 'vehicleBinding?id=' + item.id + '&carLicenseNumber=' + item.carLicenseNumber
			});
		},
		/* 添加车牌 */
		addCard() {
			if (this.priceList.length >= 3) {
				uni.showToast({
					title: '每个人最多只能绑定三张车牌哦!',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: 'vehicleBinding'
			});
		},
		//添加或修改成功之后回调
		deleteShow(item) {
			if (this.type != 1) {
				return;
			} else {
				console.log(item);
				uni.setStorageSync('plateNumber', item.carLicenseNumber);
				uni.setStorageSync('PNDID', item.id);
				uni.navigateBack();
			}
		},
		cardArray() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/park/getCarList',
				method: 'get',
				success: res => {
					if (res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.priceList = res.data.data;
							this.statusID = true;
						} else {
							this.statusID = false;
						}
					} else {
						this.statusID = false;
					}
				},
				complete: data => {
					uni.hideLoading();
				}
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
.box-icon {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-right: 40rpx;
}
/* 	.box-icon view{
		height: 40rpx;
		width: 40rpx;
	} */
</style>
