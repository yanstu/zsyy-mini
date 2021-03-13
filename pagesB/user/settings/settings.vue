<!-- 设置页面 -->
<template>
	<view>
		<uni-list class="uList"><uni-list-item class="uniListItem" style="font-weight: normal;" @click="clear" title="清除缓存(退出登录)" /></uni-list>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		clear() {
			uni.showModal({
				title: '提示',
				content: '是否清除所有缓存?',
				showCancel: true,
				cancelText: '否',
				confirmText: '是',
				success: res => {
					if (res.confirm) {
						this.$req.request({
							url: 'api/user/logout',
							method: 'get',
							success: res => {
								if (res.data.code == 200) {
									uni.clearStorage();
									uni.showToast({
										title: '清除成功',
										icon: 'none'
									});
									uni.reLaunch({
										url: '../user'
									});
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									});
								}
							},
							complete: data => {}
						});
					}
				}
			});
		}
	}
};
</script>

<style></style>
