<template>
	<view class="inspection">
		<view class="cu-form-group">
			<view class="title">
				名称：
				<!-- <text class="text-red">*</text> -->
			</view>
			<input disabled name="input" v-model:value="form.name" />
		</view>
		<view class="cu-form-group">
			<view>设备状态：</view>
			<ld-select style="width: 75%;" :list="options" list-key="label" value-key="value" placeholder="请选择" v-model="form.type" @change="selectChange"></ld-select>
		</view>
		<view style="height: 10rem;" v-show="form.type == 1" class="cu-form-group">
			<view class="title">
				备注：
				<text class="text-red">*</text>
			</view>
			<textarea style="height: 9rem;" placeholder="请输入具体损坏备注" maxlength="-1" v-model:value="form.remarks" />
		</view>
		<view v-show="form.type == 1" class="cu-form-group area">
			<view class="title">
				照片：
				<text class="text-red">*</text>
			</view>
			<view class="photo" @click="goCamera">
				<view v-if="frontShow" v-text="'暂\n无\n图\n片'"></view>
				<image v-if="!frontShow" class="front" :src="form.url"></image>
			</view>
		</view>
		<view @click="submit" :class="'submit' + (form.type == 1 ? ' danger' : '')">提交</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanPicker from '@/wxcomponents/vant/picker';
import vanEmpty from '@/wxcomponents/vant/empty';
// #endif
// #ifdef MP-ALIPAY
import vanPicker from '@/components/vant/picker';
import vanEmpty from '@/components/vant/empty';
// #endif
export default {
	components: {
		vanPicker,
		vanEmpty
	},
	data() {
		return {
			communityId: '',
			form: {
				name: '',
				type: 0,
				url: '',
				remarks: ''
			},
			options: [
				{
					value: '0',
					label: '正常'
				},
				{
					value: '1',
					label: '上报'
				}
			],
			frontShow: true,
			qrId: ''
		};
	},
	onUnload() {
		uni.redirectTo({
			url: 'photograph'
		});
	},
	onLoad(option) {
		this.qrId = option.qrId;
	},
	async onShow() {
		this.user = uni.getStorageSync('userList');
		this.getName();
		const ret = await this.isPersonnel();
		if (!this.user || !this.user.phone || !ret.data.data == 1) {
			uni.showToast({
				title: '非正常进入',
				duration: 2000,
				icon: 'none'
			});
			uni.switchTab({
				url: '../home/home'
			});
			return;
		}
	},
	methods: {
		getName() {
			this.$req.request({
				url: 'api/form/getRemarks',
				method: 'get',
				data: {
					id: this.qrId
				},
				success: res => {
					if (res.data.code == 200) {
						this.form.name = res.data.data.remarks;
						this.communityId = res.data.data.communityId;
					}
				},
				complete: data => {}
			});
		},
		submit() {
			this.$req.request({
				url: 'api/form/report',
				method: 'get',
				data: {
					phone: this.user.phone,
					name: this.form.name,
					remarks: !this.form.remarks ? '1' : this.form.remarks,
					type: this.form.type,
					url: !this.form.url ? '1' : this.form.url
				},
				success: res => {
					if (res.data.code == 200) {
						this.setMassage(res.data.msg);
						uni.switchTab({
							url: '../home/home'
						});
					}
				},
				complete: data => {}
			});
		},
		goCamera() {
			uni.navigateTo({
				url: 'camera/camera2'
			});
		},
		selectChange(val) {
			this.form.type = val;
		},
		isPersonnel() {
			const _this = this;
			return new Promise(function(resolve, reject) {
				_this.$req.request({
					url: 'api/form/judgeIsPhone',
					method: 'get',
					data: {
						phone: _this.user.phone,
						communityId: _this.communityId
					},
					success: res => {
						resolve(res);
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
	height: 100%;
}
.inspection {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #ffffff;
}
.submit {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 3.5rem;
	border-radius: 35rpx 35rpx 0 0;
	background-color: #00a950;
	text-align: center;
	color: white;
	font-size: 37rpx;
	/* #ifdef MP-ALIPAY */
	height: 100rpx;
	line-height: 100rpx;
	/* #endif */
}

.danger {
	background-color: #ff976a;
}
textarea {
	width: 100%;
	font-size: 25rpx;
}
.area {
	height: 12rem;
	display: flex;
	flex-direction: column;
}
.area .title {
	width: 100%;
	text-align: left;
}
.photo {
	height: 10rem;
	width: 100%;
	text-align: left;
}
.photo view,
.photo image {
	width: 10rem;
	height: 10rem;
	border: 1px solid rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
