<template>
	<view>
		<!-- 选项卡 -->
		<scroll-view scroll-x class="bg-white nav text-center fixed option" :style="[{top:CustomBar + 'px'}]">
			<view class="cu-item" :class="index==TabCur?'text-blue cur':''" v-for="(item,index) in tabNav" :key="index" @tap="tabSelect"
			 :data-id="index">
				{{tabNav[index]}}
			</view>
		</scroll-view>

		<view v-if="TabCur==0" class="item">
			<!-- 订单列表 -->
			<view class="scroll-view-item option-item" v-for="(item,index) in order" :key="index">
				<view class="option-header">
					<view>下单时间:{{item.createtime}}</view>
					<view class="text-right option-order-status">{{item.statusText}}</view>
				</view>
				<view class="option-central">
					<view class="option-central-image">
						<image :src="item.img" mode="aspectFill"></image>
					</view>
					<view class="option-central-info">
						<view>{{item.courseName}}</view>
						<view>地址:{{item.communityName+item.address}}</view>
						<view>价格:￥ <text style="color:#ED1C24;">{{item.actualPrice/100}}</text></view>
					</view>
				</view>
				<view class="text-right option-order-no">订单编号:{{item.orderNo}}</view>
				<view class="option-bottom">
					<button size="mini" @click="goOrderDeatil(item.id,item.status)">{{item.status==1?'立即支付':'查看详情'}}</button>
				</view>
			</view>
		</view>

		<view v-if="TabCur==1" class="item">
			<!-- 订单列表 -->
			<view class="scroll-view-item option-item" v-for="(item,index) in order" :key="index" v-if="item.status==1">
				<view class="option-header">
					<view>下单时间:{{item.createtime}}</view>
					<view class="text-right option-order-status">{{item.statusText}}</view>
				</view>
				<view class="option-central">
					<view class="option-central-image">
						<image :src="item.img" mode="aspectFill"></image>
					</view>
					<view class="option-central-info">
						<view>{{item.courseName}}</view>
						<view>地址:{{item.communityName+item.address}}</view>
						<view>价格:￥ <text style="color:#ED1C24;">{{item.actualPrice/100}}</text></view>
					</view>
				</view>
				<view class="text-right option-order-no">订单编号:{{item.orderNo}}</view>
				<view class="option-bottom">
					<button size="mini" @click="goOrderDeatil(item.id,item.status)">{{item.status==1?'立即支付':'查看详情'}}</button>
				</view>
			</view>
		</view>

		<view v-if="TabCur==2" class="item">
			<!-- 订单列表 -->
			<view class="scroll-view-item option-item" v-for="(item,index) in order" :key="index" v-if="item.status==2">
				<view class="option-header">
					<view>下单时间:{{item.createtime}}</view>
					<view class="text-right option-order-status">{{item.statusText}}</view>
				</view>
				<view class="option-central">
					<view class="option-central-image">
						<image :src="item.img" mode="aspectFill"></image>
					</view>
					<view class="option-central-info">
						<view>{{item.courseName}}</view>
						<view>地址:{{item.communityName+item.address}}</view>
						<view>价格:￥ <text style="color:#ED1C24;">{{item.actualPrice/100}}</text></view>
					</view>
				</view>
				<view class="text-right option-order-no">订单编号:{{item.orderNo}}</view>
				<view class="option-bottom">
					<button size="mini" @click="goOrderDeatil(item.id,item.status)">{{item.status==1?'立即支付':'查看详情'}}</button>
				</view>
			</view>
		</view>

		<view v-if="TabCur==3" class="item">
			<!-- 订单列表 -->
			<view class="scroll-view-item option-item" v-for="(item,index) in order" :key="index" v-if="item.status==3 || item.status==4">
				<view class="option-header">
					<view>下单时间:{{item.createtime}}</view>
					<view class="text-right option-order-status">{{item.statusText}}</view>
				</view>
				<view class="option-central">
					<view class="option-central-image">
						<image :src="item.img" mode="aspectFill"></image>
					</view>
					<view class="option-central-info">
						<view>{{item.courseName}}</view>
						<view>地址:{{item.communityName+item.address}}</view>
						<view>价格:￥ <text style="color:#ED1C24;">{{item.actualPrice/100}}</text></view>
					</view>
				</view>
				<view class="text-right option-order-no">订单编号:{{item.orderNo}}</view>
				<view class="option-bottom">
					<button size="mini" @click="goOrderDeatil(item.id,item.status)">{{item.status==1?'立即支付':'查看详情'}}</button>
				</view>
			</view>

			<view v-if="TabCur==4" class="item">
				<!-- 订单列表 -->
				<view class="scroll-view-item option-item" v-for="(item,index) in order" :key="index" v-if="item.status==5">
					<view class="option-header">
						<view>下单时间:{{item.createtime}}</view>
						<view class="text-right option-order-status">{{item.statusText}}</view>
					</view>
					<view class="option-central">
						<view class="option-central-image">
							<image :src="item.img" mode="aspectFill" style="border-radius: 5px;"></image>
						</view>
						<view class="option-central-info">
							<view>{{item.courseName}}</view>
							<view>地址:{{item.communityName+item.address}}</view>
							<view>价格:￥ <text style="color:#ED1C24;">{{item.actualPrice/100}}</text></view>
						</view>
					</view>
					<view class="text-right option-order-no">订单编号:{{item.orderNo}}</view>
					<view class="option-bottom">
						<button size="mini" @click="goOrderDeatil(item.id,item.status)">{{item.status==1?'立即支付':'查看详情'}}</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'

	export default {
		components: {
			uniSection,
			uniSegmentedControl
		},
		data() {
			return {
				CustomBar: this.CustomBar,
				TabCur: 0,
				tabNav: ['全部', '待支付', '已支付', '已取消', '已完成 '],
				current: 0,
				styleType: 'text',
				order: {},
				token: ''
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('userList').accessToken
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.orderArray();
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			//查询所有订单
			orderArray() {
				let that = this
				that.$req.request({
					url: 'api/order/getOrderList',
					data: {
						'pageNo': '1',
						'pageSize': '10000',
						'type': '0',
					},
					success: (res) => {
						if (res.data.code == 200) {
							that.order = res.data.data.items
							for (let i = 0; i < that.order.length; i++) {
								if (that.order[i].status == 1) {
									that.order[i].statusText = '待支付'
								} else if (that.order[i].status == 2) {
									that.order[i].statusText = '已支付'
								} else if (that.order[i].status == 3) {
									that.order[i].statusText = '已取消'
								} else if (that.order[i].status == 4) {
									that.order[i].statusText = '已取消(系统)'
								} else if (that.order[i].status == 5) {
									that.order[i].statusText = '已完成'
								}
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
				})
			},
			goOrderDeatil(orderId,status) {
				uni.setStorageSync("orderId",orderId)
				uni.setStorageSync("orderStatus",status)
				uni.navigateTo({
					url: './orderList',
				});
			}
		}
	}
</script>

<style>
	.cu-item {
		width: 15%;
		font-weight: 700;
	}

	.item {
		margin-top: 115upx;
	}

	.option-item {
		width: 700upx;
		margin: 0 auto;
		border-radius: 10upx;
		background-color: #FFFFFF;
		margin-top: 20upx;
	}

	.option-central {
		display: flex;
		width: 100%;
		padding: 15upx 0upx 0upx 20upx;
		/* border-bottom: 1px solid #CFCFCF; */
	}

	.option-central-image image {
		width: 150upx;
		height: 130.5upx;
	}

	.option-header {
		display: flex;
		justify-content: space-between;
		font-size: 30upx;
		color: #000000;
		border-bottom: 1px solid #D4D4D4;
		padding-top: 15upx;
		padding-bottom: 15upx;
		padding-left: 15upx;
	}

	.option-central-info {
		width: 530upx;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding-left: 20upx;
	}

	.option-central-info view {
		padding-top: 7upx;
		padding-bottom: 7upx;
	}

	.option-bottom {
		width: 100%;
		text-align: right;
	}

	.option-order-no {
		/* border-bottom: 1px solid #CFCFCF; */
		padding: 8upx 0upx;
	}

	.option-order-status {
		padding-right: 50upx;
		color: #ED1C24;
	}

	.option-bottom button {
		width: 220upx;
		height: 70upx;
		line-height: 70upx;
		border: 1px solid #FFFFFF;
		margin-right: 70upx;
		background-color: #FFFFFF;
		color: #000000;
		margin-bottom: 5upx;
		margin-top: 5upx;
	}
</style>
