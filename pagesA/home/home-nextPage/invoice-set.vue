<!-- 发票设置 -->
<template>
	<view>
		<view class="header">
			<view>抬头类型</view>
			<view>
				<radio :checked="enterpriseSelect" @tap="checkboxSelect(0)"></radio>
				企业单位
			</view>
			<view>
				<radio :checked="selfSelect" @tap="checkboxSelect(1)"></radio>
				个人/非企业单位
			</view>
		</view>
		<view class="main">
			<view v-for="(item, index) in enterpriseList.length? enterpriseList:selfList " :key="index">
				{{ item.name }}
				<view v-html="index<2? addHtml:''"></view>
				<input type="text" :placeholder="item.placeholder" @input="message($event,index)">
			</view>
		</view>
		<view class="foot">
			<view class="foot-btn" @click="Storage" :class="btnShow">保存</view>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				addHtml: '*',
				enterpriseList: [{
						'name': '公司名称',
						'placeholder': '请输入公司名字'
					},
					{
						'name': '公司税号',
						'placeholder': '填写纳税人识别号'
					},
					{
						'name': '注册地址',
						'placeholder': '请填写公司注册地址'
					},
					{
						'name': '注册电话',
						'placeholder': '请填写公司注册电话'
					},
					{
						'name': '开户银行',
						'placeholder': '请填写公司开户银行'
					},
					{
						'name': '银行账号',
						'placeholder': '请填写银行账号'
					}
				],
				selfList: [{
					'name': '抬头名称',
					'placeholder': '请输入抬头名称'
				},{
					'name': '发票说明',
					'placeholder': '简介个人发票说明'
				}
				],
				enterpriseSelect: true,
				selfSelect: false,
				inputInfo: [],
				btnShow: ''
			}
		},
		methods: {
			message(event, index) {
				// Vue.set(this.inputInfo, index, event.detail.value)
				this.inputInfo[index] = event.detail.value
				if ((this.inputInfo[0]?this.inputInfo[0].length:0) != 0 && (this.inputInfo[1]?this.inputInfo[1].length:0) != 0) {
					this.btnShow = 'btnShow'
				} else {
					this.btnShow = ''
				}
			},
			checkboxSelect(e) {
				if (e == 1) {
					this.enterpriseList = []
					this.enterpriseSelect = false
					this.selfSelect = true
				} else {
					if (this.enterpriseList.length == 0) {
						this.enterpriseList.push({
							'name': '公司名称',
							'placeholder': '请输入公司名字'
						}, {
							'name': '公司税号',
							'placeholder': '填写纳税人识别号'
						}, {
							'name': '注册地址',
							'placeholder': '请填写公司注册地址'
						}, {
							'name': '注册电话',
							'placeholder': '请填写公司注册电话'
						}, {
							'name': '开户银行',
							'placeholder': '请填写公司开户银行'
						}, {
							'name': '银行账号',
							'placeholder': '请填写银行账号'
						})
					}
					this.enterpriseSelect = true
					this.selfSelect = false
				}
			},
			Storage() {
				if (this.btnShow == 'btnShow') {
					let pages = getCurrentPages();
					let currPage = pages[pages.length - 1]; //当前页面
					let prevPage = pages[pages.length - 2]; //上一个页面
					prevPage.setData({
						invoiceInfo: this.inputInfo
					})
					// prevPage.$vm.invoiceInfo = this.inputInfo;
					// 确认提示框
					uni.showModal({
						title: '提示',
						content: '确认保存吗？',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack();
							} else if (res.cancel) {
								uni.showToast({
									title: '已取消',
									icon: 'none'
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: rgb(242, 243, 245);
	}

	.header {
		display: flex;
		background-color: rgb(254, 254, 254);
		height: 100rpx;
		margin-top: 5%;
	}

	.header view {
		margin-left: 5%;
		line-height: 100rpx;
		font-size: 30rpx;
	}

	radio {
		margin-right: 15rpx;
	}

	.main {
		margin-top: 1rpx;
		background-color: rgb(254, 254, 254);
	}

	.main view {
		margin-left: 5%;
		display: flex;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid rgb(242, 243, 245);
	}

	.main view view {
		left: 15%;
		color: red;
		position: absolute;
	}

	.main input {
		height: 100rpx;
		margin-left: 5%;
		width: 60%;
	}

	.foot {
		width: 100%;
		background-color: rgb(254, 254, 254);
		position: absolute;
		bottom: 0;
		height: 150rpx;
	}

	.foot-btn {
		margin: 2.5% auto;
		width: 90%;
		height: 120rpx;
		background-color: rgb(203, 203, 203);
		border-radius: 10rpx;
		color: rgb(246, 246, 246);
		text-align: center;
		line-height: 120rpx;
		font-size: 40rpx;
	}

	.btnShow {
		background-color: rgb(73, 75, 90);
	}
</style>
