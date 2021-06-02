<!-- 绑定车牌  第一次绑定和换绑二合一 -->
<template>
	<view>
		<view class="father">
			<view class="content"><image :src="img" mode="aspectFit"></image></view>
			<view class="bindingInfo">
				<view class="title">请确定车辆绑定</view>
				<view class="input">
					<!-- #ifdef MP-WEIXIN -->
					<input :value="carNo" disabled @click="showCarNo" style="text-align: center;" :maxlength="maxlength" />
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY -->
					<input :value="carNo" disabled @click="showCarNo" style="background-color: #F1F1F1;text-align: center;" :maxlength="maxlength" />
					<!-- #endif -->
				</view>
				<view class="container">
					<view class="button" v-if="!id"><button type="primary" size="mini" @click="submit">绑定车牌</button></view>
					<view class="button" v-else><button type="primary" size="mini" @click="submit">更换绑定</button></view>
					<view class="button" v-if="id"><button type="primary" size="mini" @click="delCard">解除绑定</button></view>
				</view>
			</view>
		</view>
		<carnoKeyboard :showKeyboard.sync="modalShow" @kInput="onInput" @kDelete="onDelete" @kConfirm="onConfirm" @kClose="onClose"></carnoKeyboard>
	</view>
</template>

<script>
import carnoKeyboard from '@/components/carno-keyboard/carno-keyboard.vue';
export default {
	components: {
		carnoKeyboard
	},
	data() {
		return {
			id: '',
			btnVal: '',
			img: 'https://kshht.gzmsdw.cn/imge_zsyy/html/车辆绑定.png',
			flag: false,
			token: '',
			carNo: '',
			modalShow: false,
			maxlength: 8
		};
	},
	onLoad(options) {
		this.token = uni.getStorageSync('userList').accessToken;
		if (options.id) {
			/* 更换绑定 */
			this.id = options.id;
			this.carNo = options.carLicenseNumber;
			this.btnVal = '更换绑定';
			this.flag = true;
		} else {
			/* 第一次进入 绑定车辆 */
			this.btnVal = '确定绑定';
		}
	},
	methods: {
		showCarNo() {
			this.modalShow = true;
		},
		onInput(item) {
			if (this.carNo.length < 8) {
				this.carNo += item;
			}
		},
		onDelete() {
			this.carNo = this.carNo.substr(0, this.carNo.length - 1);
		},
		onConfirm() {
			this.modalShow = false;
		},
		onClose() {
			this.modalShow = false;
		},
		delCard() {
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			this.$req.request({
				url: 'api/park/deleteCar',
				method: 'get',
				data: {
					carId: this.id
				},
				success: res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: res.data.msg,
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
				complete: data => {
					uni.hideLoading();
				}
			});
		},
		submit() {
			var card_reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
			if (!card_reg.test(this.carNo)) {
				uni.showToast({
					title: '车牌号错误，请重新填写',
					icon: 'none'
				});
				return;
			}
			uni.showLoading({
				title: '请稍后',
				mask: true
			});
			if (this.id != '') {
				/* 更改绑定 */
				this.$req.request({
					url: 'api/park/addOrEditCar',
					method: 'get',
					data: {
						carId: this.id,
						carLicenseNumber: this.carNo
					},
					success: res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '修改成功',
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
					complete: data => {
						uni.hideLoading();
					}
				});
			} else {
				/* 第一次绑定 */
				this.$req.request({
					url: 'api/park/addOrEditCar',
					method: 'get',
					data: {
						carId: '',
						carLicenseNumber: this.carNo
					},
					success: res => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '绑定成功',
								icon: 'none',
								duration: 1000
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
					complete: data => {
						uni.hideLoading();
					}
				});
			}
		}
	}
};
</script>

<style>
.father {
	position: relative;
}

.content {
	width: 100%;
	height: 550rpx;
}
.content image {
	width: 100%;
	height: 550rpx;
}

.bindingInfo {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.bindingInfo .title {
	padding-top: 5prx;
	padding-bottom: 5rpx;
	font-size: 30rpx;
	font-weight: 600;
	text-align: center;
	margin-top: 50rpx;
}

.input {
	border-bottom: 1px solid #315cdc;
	color: #315cdc;
	font-weight: 600;
	text-align: center;
	margin-bottom: 50rpx;
	margin-top: 30rpx;
	width: 250rpx;
	margin: 0 auto;
	margin-top: 30rpx;
}
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 75rpx;
	margin-top: 50rpx;
}
.button {
	flex: 1;
	margin: 0 2%;
	width: 46%;
}
.button button {
	background: linear-gradient(to right, #ff8600, #ff5e00);
	text-align: center;
	border-radius: 50rpx;
	height: 75rpx;
	line-height: 75rpx;
	font-size: 30rpx;
	width: 100%;
}
</style>
