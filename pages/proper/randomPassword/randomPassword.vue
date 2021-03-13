<!-- 随机密码 -->
<template>
	<view>
		<view class="father">
			<text v-for="item in password">{{item}}</text>
			<button size="mini" @click="copy">复制</button>
		</view>

		<view class="tips">随机密码生成</view>
	</view>
</template>

<script>
	import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
	export default {
		data() {
			return {
				password: [
					1, 2, 3, 4, 5, 6
				]
			}
		},
		methods: {
			copy() {
				let content = ''//需要复制的内容
				this.password.forEach(item=>{
					content=content+item
				})
				content = typeof content === 'string' ? content : content.toString() // 复制内容，必须字符串，数字需要转换为字符串
				const result = uniCopy(content)
				if (result === false) {
					uni.showToast({
						title: '不支持',
					})
				} else {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	.father {
		margin-top: 50rpx;
		float: left;
		width: 100%;
		padding-left: 12px;
	}

	.father text,
	button {
		float: left;
	}

	.father text {
		background-color: #FFFFFF;
		padding: 13px;
		text-align: center;
		margin: 4px;
	}

	.father button {
		padding: 10px;
		margin-left: 5px;
	}

	.tips {
		text-align: center;
		font-size: 30rpx;
		color: #777777;
		font-weight: 700;
	}
</style>
