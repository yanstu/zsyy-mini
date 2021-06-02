<template>
	<view>
		<view class="cu-form-group">
			<view class="title">我的停车位</view>
			<view>
				<picker style="padding-right: 0;" :range="carLicenseNumber" @change="choice">
					<text>{{ (carLicenseNumber.length == 0)? '您暂未绑定车牌号':carLicenseNumber[select] }}</text>
				</picker>				
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">应缴费</view>
			<text class="" style="color: red;">￥{{ money }}</text>
		</view>
		<view class="container">
			{{ msg }}
		</view>
		<view class="action-section targrad" :class="(money==0)?'gary':''" @click="paylog" style="background: #3b9108;">
			<view style="margin: auto;font-size: 18px; color: #ffffff;">立即缴费</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token: '',
				carLicenseNumber: [],
				money: '0.00',
				orderNo: '', //订单编号
				select: 0,
				msg: '',//消息提示
			};
		},
		onShow() {
			uni.showLoading({
				title: '',
				mask: true
			});
			setTimeout(() => {
				this.getCarcode();
			},2000)
		},
		onLoad(option) {
			this.token = uni.getStorageSync('userList').accessToken;
			this.getMyMonthInfo();
			this.getCarcode();
			// this.payPack(0);
		},
		methods: {
			//获取用户包月信息
			getMyMonthInfo() {
				uni.showLoading({
					title: '',
					mask: true
				});
				this.$req.request({
					url: 'api/ticket/findMyMonthTicketList',
					method: 'get',
					data: {
						parkCode: ''
					},
					success: res => {
						if (res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.setMassage('您已开通包月，无需车位缴费');
								uni.switchTab({
									url: '../../service/service'
								});
							} else {}
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
			// 车牌查询
			getCarcode() {
				this.$req.request({
					url: '/api/park/getCarList',
					method: 'get',
					success: res => {
						for (let i = 0; i < res.data.data.length; i++) {
							this.carLicenseNumber.push(res.data.data[i].carLicenseNumber)
						}
						this.payPack(0);
					},
					complete: data => {
						uni.hideLoading();
					}
				})
			},
			// 停车缴费查询
			payPack(i) {
				this.$req.request({
					url: 'api/homeMqtt/getParkFee',
					header: {
						accessToken: this.token
					},
					data: {
						"carCode": this.carLicenseNumber[i]
					},
					success: res => {
						console.log(res.data)
						if(res.data.msg == '缴费查询错误') {
							if(res.data.data.zhtcData.message.indexOf('参数错误') != -1){
								this.msg = '车牌号有误'
							} else {
								this.msg = res.data.data.zhtcData.message
							}
						} else {
							this.msg = res.data.msg
						}
						// 取得缴费金额以及订单编号
						this.money = (res.data.data.data.actualPrice)/100
						this.orderNo = res.data.data.data.orderNo
					},
					complete: data => {
						uni.hideLoading();
					}
				})
			},
			paylog() {
				uni.navigateTo({
					url: '/pages/pay/pay?actualPrice=' + this.money + '&orderNo=' + this.orderNo,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			choice(e) {
				this.select = e.detail.value
				this.payPack(e.detail.value)
			}
		}
	};
</script>

<style>
	/* 底部栏 */
	.action-section {
		position: fixed;
		margin-bottom: 0upx;
		/* #ifdef H5 */
		margin-bottom: 0upx;
		/* #endif */
		bottom: 0upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 750upx;
		height: 120upx;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background: rgba(255, 255, 255, 0.9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, 0.5);
	}

	.gary {
		background-color: rgb(203, 203, 203) !important;
		z-index: -100;
	}
	
	.container {
		height: 400rpx;
		line-height: 400rpx;
		width: 100%;
		text-align: center;
		font-size: 40rpx;
		color: rgb(203, 203, 203);
	}
</style>
