<!-- 业主信息录入 -->
<template>
	<view>
		<form>
			<view class="cu-form-group">
				<view class="title">
					姓名：
					<text class="text-red">*</text>
				</view>
				<input placeholder="姓名" name="input" v-model:value="name" />
			</view>

			<view class="cu-form-group cu-bar">
				<view>
					小区选择：
					<text class="text-red">*</text>
				</view>
				<view class="action text-right" @click="goComSel">
					{{ item.name == null ? '选择' : item.name }}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group cu-bar">
				<view>
					单元选择：
					<text class="text-red">*</text>
				</view>
				<view class="action text-right" @click="goUnit">
					{{ item == null ? '请先选择小区' : unit == null ? '去选择' : unit.unitName }}
					<text class="cuIcon-right"></text>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					门牌号：
					<text class="text-red">*</text>
				</view>
				<input placeholder="门牌号" name="input" v-model:value="doorNum" />
			</view>
			<view class="cu-form-group ">
				<view class="title">车牌号：</view>
				<input placeholder="车牌号" name="input" v-model:value="carLicenseNumber" />
			</view>

			<view class="cu-form-group">
				<view class="title">停车位：</view>
				<input placeholder="停车位" name="input" v-model:value="parkingSeat" />
			</view>
			<view class="cu-form-group">
				<view class="title">
					手机号码：
					<text class="text-red">*</text>
				</view>
				<input :style="phoneColor ? 'color:red' : ''" @focus="Inputfocus" placeholder="请输入手机号码" type="number" maxlength="11" name="input" v-model:value="phone" />
				<view class="cu-capsule radius">
					<view class="cu-tag bg-blue ">+86</view>
					<view class="cu-tag line-blue">中国大陆</view>
				</view>
			</view>
			<text class="tips">{{ tips }}</text>
			<view class="cu-form-group">
				<input placeholder="请输入验证码" name="code" v-model="code" />
				<button class="cu-btn bg-green shadow" @click="sendCode">{{ message }}</button>
			</view>
		</form>
		<button class="btn" @click="subInfo">录入信息</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '', //姓名，
			phone: '', //电话
			carLicenseNumber: '', //车牌号
			parkingSeat: '', //停车位
			doorNum: '', //门牌号
			token: '',
			item: null,
			phoneColor: false,
			message: '获取验证码',
			disabled: true,
			num: 60,
			tips: '',
			code: null,
			unit: null
		};
	},
	onLoad() {
		var res = this.checkLogin('../proper/ownerInfoInput/ownerInfoInput', '2');
		if (!res) {
			return false;
		}
		this.token = uni.getStorageSync('userList').accessToken;
	},
	methods: {
		goUnit() {
			if (this.item == null) {
				return;
			}
			uni.navigateTo({
				url: 'unit/unit?cId=' + this.item.communityId
			});
		},
		/* 发送验证码 */
		sendCode() {
			if (this.phone != '' || this.phone != null) {
				if (this.checkMobile(this.phone)) {
					this.tips = '';
					if (this.disabled) {
						//1:给指定手机号发送验证码
						this.$req.request({
							url: 'api/user/sendVerifyCode',
							method: 'get',
							data: {
								type: '',
								phone: this.phone
							},
							success: res => {},
							complete: data => {}
						});
						//2:进入倒计时
						this.timeoutChangeStyle();
					}
				} else {
					this.tips = '手机号格式不正确';
				}
			} else {
				this.tips = '请输入11位手机号码';
			}
		},
		/* 倒计时方法 */
		timeoutChangeStyle() {
			this.disabled = false;
			if (this.num == 0) {
				this.message = '发送验证码';
				this.num = 60;
				this.disabled = true;
			} else {
				this.message = this.num + 's后再次发送';
				this.num = this.num - 1;
				setTimeout(this.timeoutChangeStyle, 1000);
			}
		},
		/* 跳转到小区选择 */
		goComSel() {
			this.unit = null;
			uni.navigateTo({
				url: 'communitySelection/communitySelection?type=1'
			});
		},
		/* 手机号验证 */
		checkMobile(mobile) {
			return RegExp(/^1[34578]\d{9}$/).test(mobile);
		},
		/* 车牌验证 */
		checkCartNo(cartNo) {
			return RegExp(
				/^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/
			).test(cartNo);
		},
		Inputfocus() {
			this.phoneColor = false;
		},
		/* 提交信息 */
		subInfo() {
			if (this.name == null || this.name.trim() == '') {
				uni.showToast({
					title: '请输入您的姓名',
					icon: 'none'
				});
				return;
			}
			if (this.item == null) {
				uni.showToast({
					title: '请选择小区',
					icon: 'none'
				});
				return;
			}
			if (this.unit == null) {
				uni.showToast({
					title: '请选择你的单元',
					icon: 'none'
				});
				return;
			}
			if (this.doorNum == null || this.doorNum.trim() == '') {
				uni.showToast({
					title: '请输入门牌号',
					icon: 'none'
				});
				return;
			}
			if (this.carLicenseNumber.trim() != '') {
				if (!this.checkCartNo(this.carLicenseNumber)) {
					uni.showToast({
						title: '请输入正确的车牌',
						icon: 'none'
					});
					return;
				}
			}
			if (this.phone == null || this.phone == '') {
				uni.showToast({
					title: '手机号不能为空',
					icon: 'none'
				});
				return;
			}
			if (!this.checkMobile(this.phone)) {
				this.phoneColor = true;
				uni.showToast({
					title: '手机号格式不正确',
					icon: 'none'
				});
				return;
			}
			if (this.code == null || this.code.trim() == '') {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				return;
			}
			this.$req.request({
				url: 'api/community/addOrEditOwner',
				method: 'get',
				data: {
					phone: this.phone.trim(),
					name: this.name.trim(),
					communityId: this.item.communityId,
					unitId: this.unit.id,
					carLicenseNumber: this.carLicenseNumber,
					parkingSeat: this.parkingSeat,
					doorNum: this.doorNum.trim(),
					smsCode: this.code.trim()
				},
				success: res => {
					if (res.data.code == 200) {
						uni.showModal({
							title: '提示',
							content: '录入信息成功，请等待管理员审核',
							showCancel: true,
							cancelText: '返回',
							confirmText: '查看状态',
							success: res => {
								this.name = null;
								this.phone = null; //电话
								this.carLicenseNumber = null; //车牌号
								this.parkingSeat = null; //停车位
								this.doorNum = null; //门牌号
								this.item = null;
								this.phoneColor = false;
								this.code = null;
								this.disabled = true;
								this.num = 0;
								if (res.confirm) {
									//跳转到我的审核
									uni.redirectTo({
										url: '../myAudit'
									});
								} else {
									uni.navigateBack({
										delta: 1
									});
								}
							}
						});
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
.cu-form-group .title {
	min-width: calc(4em + 15px);
}

.btn {
	color: #ffffff;
	background-color: #39b54a;
	width: 100%;
	position: absolute;
	bottom: 0px;
	left: 0px;
	right: 0px;
	display: block;
	border-radius: 20px 20px 0px 0px;
	margin: 0;
}

.tips {
	display: block;
	margin: 10rpx;
	color: #ed1c24;
}
</style>
