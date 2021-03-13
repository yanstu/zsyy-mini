<template>
	<view>
		<suggest :pageType="pageType" @submit="submit"></suggest>
		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
import suggest from '@/components/bert-suggest/suggest.vue';
// #ifdef MP-WEIXIN
import Dialog from '@/wxcomponents/vant/dialog/dialog.js';
import vanDialog from '@/wxcomponents/vant/dialog/index';
// #endif
// #ifdef MP-ALIPAY
import Dialog from '@/components/vant/dialog/dialog.js';
import vanDialog from '@/components/vant/dialog/index';
// #endif
export default {
	components: { suggest, vanDialog },
	data() {
		return {
			pageType: 0
		};
	},
	onLoad(option) {
		this.pageType = option.pageType;
		uni.setNavigationBarTitle({
			title: option.pageType == 0 ? '建议和投诉' : '在线报修'
		});
	},
	methods: {
		submit(v) {
			Dialog.alert({
				title: '提示',
				message: this.pageType == 0 ? '已提交反馈，请注意查收短信或者你的邮箱' : '已提交报修，请注意维修员来电',
				theme: 'round-button'
			}).then(() => {});
		}
	}
};
</script>
