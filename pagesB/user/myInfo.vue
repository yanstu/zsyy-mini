<template>
	<view>
		<uni-list class="uList">
			<uni-list-item class="uniListItem" @click="updateName" title="姓名" :rightText="userInfo.nickname" />
		</uni-list>
		<uni-list class="uList">
			<uni-list-item class="uniListItem"  @click="igrad" title="我的车牌" :rightText="grad" />
		</uni-list>
		<uni-list class="uList">
			<!-- <uni-list-item class="uniListItem" title="手机号" @click="upPhone" :rightText="userInfo.phone?userInfo.phone:'未授权手机号'" /> -->
			<uni-list-item class="uniListItem" title="手机号" :showArrow="!userInfo.phone" @click='upPhone' :rightText="userInfo.phone?userInfo.phone:'未授权手机号'" />
		</uni-list>
		<uni-list class="uList">
			<uni-list-item class="uniListItem" title="我的地址" @click="goMyAddress" />
		</uni-list>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				userInfo:null,
				phone:'',
				grad:''
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.userInfo=uni.getStorageSync('userList')
		},
		methods: {
			goMyAddress(){
				uni.navigateTo({
					url:'info/addList/addList'
				})
			},
			updateName(){
				uni.navigateTo({
					url:'updateName?name='+this.userInfo.nickname
				})
			},
			upPhone(){
				if(!this.userInfo.phone){
					uni.navigateTo({
						url:"phone"
					})
				}
			},
			igrad(){
				uni.navigateTo({
					url:"info/vehicleBinding/cardList"
				})
			},
			iproper(){
				wx.navigateTo({
					url:"./proper",
					fail(res) {
						console.log(res)
					}
				})
			},
			iname(){
				wx.navigateTo({
					url:"./userName",
					fail(res) {
						console.log(res)
					}
				})
			},
		}
	}
</script>

<style>

</style>
