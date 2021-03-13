<!-- 新闻资讯页面 -->

<template>
	<view>
		<view class="text-box" v-for="(item, index) in communityInfo" :key="index" @click="showText(whetherText,index)">
			<view class="header">
				<view class="text-titel">{{ item.title }}</view>
			</view>
			<view class="main" :class="[index==page? whetherText : '']">
				<view class="main-text" :class="[index==page? mainTextChange : '']">
					<!-- <rich-text :nodes="item.detail"></rich-text> -->
					<text space="emsp"> {{ item.detail }}</text>
				</view>
				<view class="main-img">
					<image :src=" item.coverUrl " mode="" :class="[index==page? mainTextImg : '']"></image>
				</view>
			</view>
			<view class="foot">
				<view> {{ item.communityName }} </view>
				<view>{{ item.updatetime }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				communityInfo: [],
				communityID: [],
				whetherText: '',
				page: '',
				mainTextChange: '',
				mainTextImg: '',
				userInfo: [],
			}
		},
		onLoad(options) {
			this.userInfo = uni.getStorageSync('userList')
			this.findCommunityId()
		},
		methods: {
			// 获得用户小区ID
			findCommunityId() {
				this.$req.request({
					url: '/api/community/getUserCommunityList',
					method: 'get',
					data: {
						userId: this.userInfo.id
					},
					success: res => {
						this.communityID = res.data.data[0].id
						this.findNews()
					}
				})
			},
			// 获得小区新闻信息
			findNews() {
				this.$req.request({
					url: '/api/banner/getDetail',
					method: 'get',
					data: {
						communityId: this.communityID,
						pageIndex: '1',
						pageSize: '100'
					},
					success: res => {
						this.communityInfo = res.data.data
					}
				})
			},



			//显示文本内容 
			showText(e, i) {
				this.page = ''
				this.mainTextChange = ''
				this.mainTextImg = ''
				if (e == '') {
					this.whetherText = 'true'
					this.mainTextChange = 'main-text-change'
					this.mainTextImg = 'main-img-change'
				} else if (e == 'flase') {
					this.whetherText = 'true'
					this.mainTextChange = 'main-text-change'
					this.mainTextImg = 'main-img-change'
				} else {
					this.whetherText = 'flase'
				}
				this.page = i
			}
		}
	}
</script>

<style>
	.page {
		overflow: hidden;
	}

	.text-box {
		height: 100%;
		width: 90%;
		border-radius: 30rpx;
		box-shadow: 5px 5px 5px 5px #CCCCCC;
		margin: 0 auto;
		margin-top: 5%;
	}

	.text-titel {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		overflow-x: hidden;
	}

	.main {
		display: flex;
		height: 200rpx;
		justify-content: space-around;
		overflow: auto;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		margin: 10rpx 0;
	}


	.main-text {
		width: 65%;
		position: relative;
	}

	/* 中部文字变化 */
	.main-text-change {
		width: 85% !important;
		margin-top: 260rpx;
		margin-left: -323rpx;
		overflow: auto;
	}

	.main-text rich-text {
		text-indent: 2em;
		position: absolute;
		display: block;
		left: 0;
	}

	.main-img {
		width: 30%;
		height: 200rpx;
	}

	.main-img image {
		width: 200rpx;
		height: 200rpx;
		position: absolute;
	}

	/* 中部图片变化 */
	.main-img-change {
		width: 600rpx !important;
		height: 250rpx !important;
		margin-left: -17rpx;
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50rpx !important;
	}

	.foot view {
		text-align: right;
		margin: 10rpx 20rpx;
	}


	/* 显示文本内容 */
	.flase {
		animation: flaseLayer 0.2s linear both;
	}

	.true {
		flex-direction: row-reverse;
		animation: trueLayer 0.2s linear both;
	}

	@keyframes trueLayer {
		0% {
			height: 200rpx;
			/* transform: translatey(0%); */
		}

		100% {
			/* transform: translatey(100%); //这里可以通过变大变小调整偏移量 */
			height: 800rpx;
		}
	}

	@keyframes flaseLayer {
		0% {
			height: 800rpx;
			/* transform: translatey(0%); */
		}

		100% {
			height: 200rpx;
			/* transform: translatey(100%); //这里可以通过变大变小调整偏移量 */
		}
	}
</style>
