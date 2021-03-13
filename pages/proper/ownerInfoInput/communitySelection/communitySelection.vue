<!-- 小区选择 -->
<template>
	<view>
		<view class="cu-bar bg-white search fixed" :style="[{ top: CustomBar + 'px' }]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="搜索" v-model:value="keywords" />
			</view>
			<view class="action"><button class="cu-btn bg-gradual-green shadow-blur round" @click="search">搜索</button></view>
		</view>

		<scroll-view
			scroll-y
			class="indexes"
			:scroll-into-view="'indexes-' + listCurID"
			:style="[{ height: 'calc(100vh - ' + CustomBar + 'px - 50px)' }]"
			:scroll-with-animation="true"
			:enable-back-to-top="true"
		>
			<view v-for="(item, index) in list" :key="item.id" v-if="item.show" class="bg-white community-item text-black" @click="sendMsg(list[index])">
				{{ item.name }}
				<text class="text-gray community-item-address">地址：{{ item.address }}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			CustomBar: this.CustomBar,
			listCurID: '',
			list: [],
			pageNo: 1,
			pageSize: 10,
			keywords: '',
			type: 0,
			user: null
		};
	},
	onLoad(option) {
		this.user = uni.getStorageSync('userList');
		if (option.type) {
			this.type = option.type;
		}
		this.findCommunityList(option.showType);
	},
	methods: {
		/* 获取小区列表 */
		findCommunityList(showType) {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			this.$req.request({
				url: !showType ? 'api/community/findCommunityList' : 'api/community/getUserCommunityList',
				method: 'get',
				data: !showType
					? {
							name: '',
							pageNo: this.pageNo,
							pageSize: this.pageSize
					  }
					: {
							userId: this.user.id
					  },
				success: res => {
					if (res.data.code == 200) {
						for (let i of res.data.data) {
							if (!showType) {
								this.list.push({
									address: i.address,
									communityId: i.communityId,
									createtime: i.createtime,
									estateName: i.estateName,
									lat: i.lat,
									lot: i.lot,
									name: i.name,
									parkCode: i.parkCode,
									parkId: i.parkId,
									show: true
								});
							} else {
								this.list.push({
									address: i.address,
									communityId: i.id,
									createtime: i.createtime,
									estateName: i.estateName,
									lat: i.lat,
									lot: i.lot,
									name: i.name,
									parkCode: i.parkCode,
									parkId: i.parkId,
									show: true
								});
							}
						}
						if (!showType) {
							if (this.list.length == 0) {
								uni.showToast({
									title: '还未录入任何小区，请先前往主页"小区服务 -> 业主信息录入"',
									icon: 'none'
								});
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
			});
		},
		search() {
			/* 检索 */
			if (this.keywords != '') {
				uni.showLoading({
					title: '加载中'
				});
				setTimeout(() => {
					for (let i = 0; i < this.list.length; i++) {
						if (!this.list[i].name.includes(this.keywords)) {
							this.list[i].show = false;
						} else {
							this.list[i].show = true;
						}
					}
					uni.hideLoading();
				}, 1000);
			} else {
				uni.showToast({
					title: '请输入检索关键字',
					icon: 'none'
				});
			}
		},
		sendMsg(item) {
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let nowPage = pages[pages.length - 1]; //当前页页面实例
			let prevPage = pages[pages.length - 2]; //上一页页面实例
			if (this.type != 1) {
				prevPage.$vm.addressData.communityName = item.name; //修改上一页item里面参数值
				prevPage.$vm.addressData.communityId = item.communityId; //修改上一页item里面参数值
			} else {
				prevPage.$vm.item = item; //修改上一页item里面参数值
			}
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style>
.community-item {
	height: 90upx;
	line-height: 90upx;
	padding-left: 25upx;
	font-size: 120%;
	border-top: 1rpx solid rgba(81, 81, 81, 0.1);
}

.community-item:nth-of-type(1) {
	margin-top: 15rpx;
}

.indexes {
	position: relative;
	top: 45px;
}

.community-item-address {
	line-height: 30upx;
	font-size: 65%;
	margin-left: 15upx;
}
</style>
