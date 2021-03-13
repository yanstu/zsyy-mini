<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">姓名</text>
			<input class="input" type="text" v-model="addressData.consignee" placeholder="姓名" placeholder-class="placeholder" />
		</view>

		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="联系电话" placeholder-class="placeholder" />
		</view>

		<view class="row b-b" @click="add">
			<text class="tit">小区选择</text>
			<text class="input" style="margin-left: 20px;">
				{{ addressData.communityName }}
				<text class="cuIcon-right"></text>
			</text>
		</view>

		<view class="row b-b">
			<text class="tit">详细</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="街道、楼号、门牌" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.defaultAddress == 1 ? true : false" color="#fa436a" @change="switchChange" />
		</view>
		<view class="add-btn" @click="confirm" v-if="addressData.id == ''">提交</view>
		<view class="del-btn" @click="del" v-if="addressData.id != ''">删除</view>
		<view class="update-btn" @click="updadte" v-if="addressData.id != ''">保存</view>
	</view>
</template>

<script>
import lotusAddress from '@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue';
export default {
	data() {
		return {
			token: '',
			addressData: {
				id: '',
				communityId: '',
				communityName: '',
				consignee: '',
				phone: '',
				address: '',
				defaultAddress: 0,
				def: false
			},
			lotusAddressData: {
				visible: false,
				provinceName: '',
				cityName: '',
				townName: ''
			},
			newsid: ''
		};
	},
	onLoad(options) {
		if (options.items) {
			this.addressData = JSON.parse(decodeURIComponent(options.items));
			let title = '修改地址';
			uni.setNavigationBarTitle({
				title
			});
		}
		// 登录判断
		this.token = uni.getStorageSync('userList').accessToken;
	},
	onShow() {},
	methods: {
		switchChange(e) {
			this.addressData.defaultAddress = e.detail.value ? 1 : 0;
		},
		upadd() {
			let that = this;
			that.$req.request({
				url: 'api/address/getAddressById',
				data: {
					addressId: that.addressData.id
				},
				success: res => {
					that.addList = res.data.data;
				},
				complete: data => {}
			});
		},
		add() {
			uni.navigateTo({
				url: '/pages/proper/ownerInfoInput/communitySelection/communitySelection'
			});
		},
		/* 手机号验证 */
		checkMobile(mobile) {
			return RegExp(/^1[0-9]{10}$/).test(mobile);
		},
		//提交
		confirm() {
			const that = this;
			// let data = this.addressData;
			if (that.addressData.consignee.trim() == '' || that.addressData.consignee == null) {
				uni.showToast({
					title: '请填写姓名',
					icon: 'none'
				});
				return;
			}
			if (that.addressData.phone.trim() == '' || that.addressData.phone == null) {
				uni.showToast({
					title: '请填写手机号',
					icon: 'none'
				});
				return;
			}

			if (!this.checkMobile(this.addressData.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}

			if (!that.addressData.communityId) {
				uni.showToast({
					title: '请选择小区',
					icon: 'none'
				});
				return;
			}
			if (that.addressData.address.trim() == '' || that.addressData.address == null) {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				});
				return;
			}
			uni.showModal({
				title: '提示',
				content: '是否确认添加？',
				showCancel: true,
				confirmText: '添加',
				cancelText: '否',
				success: e => {
					if (e.confirm) {
						that.$req.request({
							url: 'api/address/addAddress',
							data: {
								communityId: that.addressData.communityId,
								address: that.addressData.address,
								defaultAddress: that.addressData.defaultAddress,
								phone: that.addressData.phone,
								consignee: that.addressData.consignee
							},
							success: res => {
								if (res.data.code == 200) {
									uni.showToast({
										title: '添加成功',
										icon: 'none'
									});
									that.addList = res.data;
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 1500);
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
			});
		},
		del() {
			const that = this;
			var userId = uni.getStorageSync('userList').id;
			uni.showModal({
				title: '删除提示',
				content: '您确定要删除该地址吗？',
				showCancel: true,
				confirmText: '删除',
				success: e => {
					if (e.confirm) {
						that.$req.request({
							url: 'api/address/deleteAddress?addressId=' + this.addressData.id,
							method: 'get',
							data: {
								userId
							},
							success: res => {
								if (res.data.code == 200) {
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									});
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 750);
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
			});
		},
		updadte() {
			if (this.addressData.consignee.trim() == '' || this.addressData.consignee == null) {
				uni.showToast({
					title: '请填写姓名',
					icon: 'none'
				});
				return;
			}
			if (this.addressData.phone.trim() == '' || this.addressData.phone == null) {
				uni.showToast({
					title: '请填写手机号',
					icon: 'none'
				});
				return;
			}
			if (!this.checkMobile(this.addressData.phone)) {
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			if (!this.addressData.communityId) {
				uni.showToast({
					title: '请选择小区',
					icon: 'none'
				});
				return;
			}
			if (this.addressData.address.trim() == '' || this.addressData.address == null) {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				});
				return;
			}
			uni.showModal({
				title: '提示',
				content: '是否更改地址？',
				showCancel: true,
				confirmText: '更改',
				cancelText: '否',
				success: e => {
					if (e.confirm) {
						this.$req.request({
							url: 'api/address/updateAddress',
							method: 'get',
							data: {
								id: this.addressData.id,
								communityId: this.addressData.communityId,
								address: this.addressData.address,
								defaultAddress: this.addressData.defaultAddress,
								phone: this.addressData.phone,
								consignee: this.addressData.consignee
							},
							success: res => {
								if (res.data.code == 200) {
									uni.showToast({
										title: '修改成功',
										icon: 'none'
									});
									this.addList = res.data;
									setTimeout(() => {
										uni.navigateBack({
											delta: 1
										});
									}, 750);
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
			});
		}
	},
	components: {
		'lotus-address': lotusAddress
	}
};
</script>
<style lang="scss">
.content {
	position: relative;
}
.row {
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30upx;
	height: 110upx;
	background: #fff;

	.tit {
		flex-shrink: 0;
		width: 120upx;
		font-size: 30upx;
		color: #000;
	}

	.input {
		flex: 1;
		font-size: 30upx;
		color: #aaa;
		text-align: right;
	}

	.icon-shouhuodizhi {
		font-size: 36upx;
		color: #aaa;
	}
}

.default-row {
	margin-top: 16upx;

	.tit {
		flex: 1;
	}

	switch {
		transform: translateX(16upx) scale(0.9);
	}
}

.add-btn {
	position: absolute;
	bottom: 0px;
	width: 100%;
	height: 80upx;
	line-height: 80upx;
	font-size: 15px;
	color: #fff;
	background-color: rgb(59, 145, 8);
	text-align: center;
}
.del-btn {
	margin: 0 auto;
	width: 60%;
	height: 80upx;
	line-height: 80upx;
	font-size: 15px;
	color: #fff;
	background-color: #ff0000;
	text-align: center;
	margin-top: 40rpx;
}
.update-btn {
	margin: 0 auto;
	margin-top: 30rpx;
	width: 60%;
	height: 80upx;
	line-height: 80upx;
	font-size: 15px;
	color: #fff;
	background-color: rgb(59, 145, 8);
	text-align: center;
}
</style>
