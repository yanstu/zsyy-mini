<template>
	<view class="">{{ parkingCode }}</view>
</template>

<script>
export default {
	data() {
		return {
			parkingCode: ''
		};
	},
	onLoad(option) {
		this.parkingCode = option.parkingCode;
	},
	methods: {}
};
</script>

<style></style>
