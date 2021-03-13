<!-- 我的包月 -->
<template>
	<view title="我的包月" class="content">
		<view class="cu-form-group">
			<view class="title">停车场</view>
			<picker @change="PickerChange" :value="index" :range="parkNames">
				<view class="picker">{{ index > -1 ? parkNames[index] : '没有开通包月' }}</view>
			</picker>
		</view>
		<!-- <uni-list class="uList">
			<uni-list-item class="uniListItem"  title="停车场" :rightText="parkingLot" />
		</uni-list> -->
		<uni-list class="uList"><uni-list-item class="uniListItem" :show-arrow="false" title="车牌" :rightText="licensePlate" /></uni-list>
		<uni-list class="uList"><uni-list-item class="uniListItem" :show-arrow="false" title="到期时间" :rightText="$req.formatDate(dueTime)" /></uni-list>
		<view class="btn" @click="open">续费</view>

		<uni-popup ref="popup" type="bottom">
			<view class="father">
				<view class="accountsInfo">账户信息：{{ accounts }}</view>
				<view class="central">
					<view class="item" :class="id == index ? 'item_active' : ''" v-for="(item, index) in list" :key="index" @click="choicePrice(index)">
						<view class="month">{{ item.month }}</view>
						<view class="money" :class="id == index ? 'money_active' : ''">
							￥
							<text>{{ item.moeny }}</text>
						</view>
					</view>
				</view>
				<view class="btn" @click="renewal">立即续费</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			index: -1,
			parkingLot: '',
			licensePlate: '',
			dueTime: '',
			accounts: '',
			list: [],
			token: '',
			monthTicketId: '',
			monthTicketConfigId: '',
			parkNames: [],
			parks: [],
			id: 0
		};
	},
	onLoad(option) {
		this.token = uni.getStorageSync('userList').accessToken;
		this.accounts = uni.getStorageSync('userInfo').nickName;
	},
	onShow() {
		this.getMyMonthInfo();
	},
	methods: {
		PickerChange(e) {
			this.index = e.detail.value;
		},
		findTicketList(val) {
			// this.getMyMonthInfo().then((res)=>{
			this.licensePlate = this.parks[val].carNo;
			this.dueTime = this.parks[val].endTime;
			this.monthTicketId = this.parks[val].monthTicketId;
			this.$req.request({
				url: 'api/ticket/findTicketList',
				method: 'get',
				data: {
					parkCode: this.parks[val].parkCode
				},
				success: result => {
					this.monthTicketId = this.parks[val].monthTicketId;
					if (result.data.code == 200) {
						this.list = result.data.data.map(item => {
							return {
								moeny: item.price,
								month: item.duration + '个月',
								monthTicketConfigId: item.monthTicketConfigId
							};
						});
						this.monthTicketConfigId = this.list[0].monthTicketConfigId;
					} else {
						uni.showToast({
							title: result.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {
					uni.hideLoading();
				}
			});
			// })
		},
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
							for (let item of res.data.data) {
								this.parkNames.push(item.parkName);
							}
							this.parks = res.data.data;
							this.index = 0;
						} else {
							uni.showToast({
								title: '没有开通包月',
								icon: 'none',
								duration: 1500
							});
							uni.redirectTo({
								url: '../../proper/parkingPackage'
							});
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
		choicePrice(index) {
			this.monthTicketConfigId = this.list[index].monthTicketConfigId;
			this.id = index;
		},
		open() {
			this.$refs.popup.open();
		},
		renewal() {
			if (this.monthTicketConfigId != '') {
				uni.showLoading({
					title: '',
					mask: true
				});
				this.$req.request({
					url: 'api/ticket/submitMonthTicketRenewalOrder',
					method: 'GET',
					data: {
						monthTicketId: this.monthTicketId,
						monthTicketConfigId: this.monthTicketConfigId
					},
					success: res => {
						console.log(res);
						if (res.data.data.orderNo) {
							uni.navigateTo({
								url: '../../pay/pay?orderNo=' + res.data.data.orderNo + '&actualPrice=' + res.data.data.actualPrice / 100
							});
						} else {
							uni.showToast({
								title: '意外错误',
								icon: 'none'
							});
						}
					},
					complete: data => {
						uni.hideLoading();
					}
				});
			} else {
				uni.showToast({
					title: '请选择包月时长',
					icon: 'none'
				});
			}
		}
	},
	watch: {
		index: function(e) {
			console.log('监听到值为' + e);
			if (e != -1) {
				this.findTicketList(e);
			}
		}
	}
};
</script>

<style>
.content {
	position: absolute;
	height: 100%;
	width: 100%;
	position: relative;
}

.content button {
	background-color: #007aff;
	color: white;
	position: absolute;
	bottom: 0upx;
	right: 0upx;
	left: 0upx;
	display: block;
}

.father {
	background-color: #ffffff;
	position: relative;
}

.accountsInfo {
	background-color: #f3f3f3;
	color: #6c6c6c;
	font-size: 30rpx;
	padding: 15rpx;
	font-weight: 600;
}

.central {
	display: flex;
	flex-wrap: wrap;
	height: 450rpx;
}

.item {
	border: 1px solid #dfdfdf;
	margin: 15rpx;
	width: 150rpx;
	height: 130rpx;
	text-align: center;
}

.item_active {
	background-color: rgb(59, 145, 8);
	color: #ffffff;
}

.month {
	font-weight: 600;
	text-align: center;
	line-height: 65rpx;
}

.money {
	color: #ffb200;
	text-align: center;
	line-height: 65rpx;
}

.money_active {
	color: #fff;
}

.money text {
	font-size: 45rpx;
	font-weight: 500;
}

.btn {
	border-radius: 35rpx 35rpx 0 0;
	width: 100%;
	color: #ffffff;
	position: absolute;
	bottom: 0px;
	left: 0px;
	right: 0px;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	background-color: rgb(59, 145, 8);
	font-size: 35rpx;
}
</style>
