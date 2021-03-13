<template>
	<view class="content">
		<!-- add -->
		<view v-if="statusID">
			<view class="list" v-for="(item, index) in addList" :key="index">
				<view class="wrapper" @click="checkAddress(item)">
					<view class="u-box">
						<text class="name text-black">{{ item.consignee }}</text>
						<text class="mobile text-gray">{{ item.phone }}</text>
					</view>
					<view class="address-box">
						<text v-if="item.defaultAddress" class="tag">默认</text>
						<text class="address text-black">{{ item.communityName }} {{ item.address }}</text>
					</view>
				</view>
				<!-- <view class="cuIcon-pullleft icon-bg" @click="checkAddress(item)" style="margin-right: 20px;"></view> -->
				<view class="cuIcon-edit icon-bg" style="font-size: 35rpx;" @click.stop="upAddress(item)"></view>
			</view>
		</view>
		<view v-if="!statusID" class="box-addressNo"><van-empty description="你还没有添加地址" /></view>
		<!-- eng -->
		<view class="add-btn" @click="addAddress">新增地址</view>
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
			source: 0,
			addressList: [],
			token: '',
			addList: [],
			statusID: false,
			action: 0 // 动作: 0普通使用, 1=选择地址 (用session取current_addr)
		};
	},
	onLoad(option) {
		if (option.type) {
			this.action = option.type;
		}
	},
	onShow(options) {
		this.token = uni.getStorageSync('userList').accessToken; //获取userList
		this.loadData();
	},
	methods: {
		//请求所有地址数据
		async loadData() {
			uni.showLoading({
				title: ''
			});
			let that = this;
			that.$req.request({
				url: 'api/address/getAllAddress',
				method: 'get',
				success: res => {
					if (res.data.code == 200) {
						if (res.data.data.length > 0) {
							that.addList = res.data.data;
							this.statusID = true;
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
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		//选择地址
		checkAddress(item) {
			if (this.action != 1) {
				return;
			}
			uni.setStorageSync('addressItem', item);
			uni.navigateBack();
		},
		//修改地址信息的id
		upAddress(item) {
			uni.navigateTo({
				url: '/pagesB/user/info/addList/address?items=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		//添加地址信息
		addAddress() {
			uni.navigateTo({
				url: './address'
			});
		}
	}
};
</script>
<style lang="scss">
/* page {
		padding-bottom: 100upx;
	} */
.content {
	position: relative;
}

.box-addressNo {
	color: rgb(149, 149, 149);
	font-size: 40rpx;
	text-align: center;
}

.list {
	display: flex;
	align-items: center;
	padding: 20upx 30upx;
	background: #fff;
	border-bottom: 1px solid rgba($color: #cccccc, $alpha: 0.3);
}

.wrapper {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.address-box {
	display: flex;
	align-items: center;

	.tag {
		font-size: 24upx;
		color: #ff813a;
		margin-right: 10upx;
		background: #fff2eb;
		border-radius: 4upx;
		padding: 4upx 10upx;
		line-height: 1;
	}

	.address {
		font-size: 28upx;
		color: #aaa;
	}
}

.u-box {
	color: #ff557f;
	margin-top: 16upx;

	.name {
		margin-right: 30upx;
		font-size: 35rpx;
	}

	.mobile {
		font-size: 28rpx;
	}
}

.icon-bg {
	height: 50upx;
	width: 50upx;
	text-align: center;
	line-height: 50upx;
	color: #546a6c;
	background-color: #dddef7;
	/* border: 1px solid #f7a0c7; */
	border-radius: 50%;
}

.add-btn {
	border-radius: 35rpx 35rpx 0 0;
	position: fixed;
	bottom: 0px;
	height: 80upx;
	width: 100%;
	line-height: 80upx;
	font-size: 35upx;
	color: #ffffff;
	background-color: rgb(59, 145, 8);
	text-align: center;
}
</style>
