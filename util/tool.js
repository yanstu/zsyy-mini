export const formatMoney = (val) => {
	var str = (val / 100).toFixed(2) + '';
	var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ',');
	var dot = str.substring(str.length, str.indexOf("."))
	var ret = intSum + dot;
	return ret;
}

//import { AMapWX } from '@/js_sdk/gaode/amap-wx.js'

export const getLocation = () => {
	return new Promise((resolve, reject) => {
		// #ifdef MP-WEIXIN
		uni.authorize({
			scope: 'scope.userLocation',
			success: (res) => {
				uni.getLocation({
					type: 'gcj02',
					success: result => {
						uni.setStorageSync('lat',
							result.latitude);
						uni.setStorageSync('lot',
							result.longitude);
						resolve()
					},
					fail: (res) => {
						uni.showModal({
							title: '提示',
							content: '请先开启手机GPS定位',
							confirmText: '确定'
						});
						reject();
					}
				});
			},
			fail: (res) => {
				uni.showModal({
					title: '授权失败',
					content: '码上到位需要获取你的地理位置，请在设置界面打开相关权限，不授权将无法使用。',
					confirmText: '设置',
					success: res => {
						if (res.confirm) {
							uni.openSetting({
								success: (data) => {
									if (data.authSetting[
											"scope.userLocation"
										] ===
										true) {
										uni.showToast({
											title: '授权成功',
											icon: 'success',
											duration: 1000,
										})
										uni.authorize({
											scope: 'scope.userLocation',
											success: res => {
												uni.getLocation({
													type: 'gcj02',
													success: result => {
														uni.setStorageSync(
															'lat',
															result
															.latitude
														);
														uni.setStorageSync(
															'lot',
															result
															.longitude
														);
													},
													fail: (
														res
													) => {
														uni.showModal({
															title: '提示',
															content: '请先开启手机GPS定位',
															confirmText: '确定'
														});
														reject
															();
													}
												});
											},
										})
										resolve()
									} else {
										uni.showToast({
											title: '授权失败',
											icon: 'none',
											duration: 1000,
										})
										reject();
									}
								}
							})
						}
					}
				})
			}
		});
		// #endif
		// #ifdef MP-ALIPAY

		uni.getLocation({
			success: res => {
				uni.setStorageSync('lat',
					res.latitude);
				uni.setStorageSync('lot',
					res.longitude);
				resolve()
			},
			fail: res => {
				console.log(res);
				switch (parseInt(res.extError)) {
					case 12:
						my.showAuthGuide({
							authType: 'LBS',
							success: (res) => {},
							fail: (error) => {
								my.alert({
									content: '不授权定位，将无法正常使用。',
								});
								reject();
							},
						});
						break
				}
				reject();
			}
		});
		// #endif
	})
}
