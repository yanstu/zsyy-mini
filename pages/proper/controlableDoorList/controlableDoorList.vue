<!-- 可控制门列表 -->
<template>
	<view>
		<uni-list class="uList"><uni-list-item title="业主远程开门" class="uniListItem" @click="gounlock"></uni-list-item></uni-list>
		<uni-list class="uList"><uni-list-item title="访客预约开门" class="uniListItem" @click="userdoor"></uni-list-item></uni-list>
		<!-- <uni-list class="uList">
			<uni-list-item title="随机密码开门" class="uniListItem" @click="goRandomPwd"></uni-list-item>
		</uni-list> -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			cardid: ''
		};
	},
	onLoad(options) {
		this.cardid = options.id;
	},
	methods: {
		goRandomPwd() {
			uni.navigateTo({
				url: '../randomPassword/randomPassword?item=' + this.cardid,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		gounlock() {
			uni.navigateTo({
				url: '../unlock/unlock?item=' + this.cardid,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		userdoor() {
			uni.navigateTo({
				url: './door?item=' + this.cardid,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		}
	}
};
</script>

<style></style>
