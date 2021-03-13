<!-- 小区对应的单元列表 -->
<template>
	<view>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="输入搜索的关键词" confirm-type="搜索" v-model:value="keywords"/>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur round" @click="search">搜索</button>
			</view> 
		</view>

		<scroll-view scroll-y class="indexes" :scroll-into-view="'indexes-'+ listCurID" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<view v-for="(item,index) in list" :key="item.id" v-if=item.show class="bg-white community-item text-black" @click="sendMsg(list[index])">
				{{item.unitName}}
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
				keywords: ''
			}
		},
		onLoad(option) {
			this.findCommunityUnitList(option.cId);
		},
		methods: {
			/* 获取小区列表 */
			findCommunityUnitList(cId) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				this.$req.request({
					url: 'api/community/findCommunityUnitList',
					method: 'get',
					data: {
						'communityId': cId,
					},
					success: res => {
						if (res.data.code == 200) {
							this.list = res.data.data
							this.list = this.list.map(v => {
								return { ...v,
									show: true
								}
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					complete: data => {
						uni.hideLoading()
					}
				})
			},
			search() {
				/* 检索 */
				if (this.keywords != '') {
					uni.showLoading({
						title: '加载中'
					});
					for (let i = 0; i < this.list.length; i++) {
						if (!this.list[i].unitName.includes(this.keywords)) {
							this.list[i].show = false
						} else {
							this.list[i].show = true
						}
					}
					uni.hideLoading();
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
				prevPage.$vm.unit = item; //修改上一页item里面参数值
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	.community-item {
		height: 90upx;
		line-height: 90upx;
		padding-left: 25upx;
		font-size: 120%;
		border-top: 1upx solid #D1D1D1;
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
