<script>
export default {
	globalData: {
		statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
		message: ''
	},
	methods: {
		login(code) {
			this.$req.request({
				url: 'api/user/miniLogin?jsCode=' + code,
				success: res => {
					if (res.data.code == 200) {
						this.syncUserInfo(res.data.data.accessToken);
					} else {
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('userList');
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		},
		syncUserInfo(token) {
			let userInfo = uni.getStorageSync('userInfo');
			let userList = uni.getStorageSync('userList');
			this.$req.request({
				url: 'api/user/syncUserInfo',
				data: {
					avatarUrl: userInfo.avatarUrl,
					gender: userInfo.gender,
					nickname: userList.nickname
				},
				success: result => {
					if (result.data.code == 200) {
						uni.setStorageSync('userList', result.data.data);
					} else {
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('autoPayStatus');
						uni.removeStorageSync('userList');
						uni.showToast({
							title: result.data.msg,
							icon: 'none'
						});
					}
				},
				complete: data => {}
			});
		}
	},
	onLaunch: function(options) {
		uni.loadFontFace({
			family: 'pingfang',
			source: 'url("https://kshht.gzmsdw.cn/imge_zsyy/html/font/PingFang.ttf")'
		});
		let isCanUse = uni.getStorageSync('userList');
		if (isCanUse) {
			uni.login({
				provider: 'weixin',
				success: res => {
					uni.getUserInfo({
						provider: 'weixin',
						success: result => {
							this.login(res.code);
						}
					});
				}
			});
		}
		const updateManager = uni.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			if (res.hasUpdate) {
				updateManager.onUpdateReady(function(res2) {
					uni.showModal({
						title: '更新提示',
						content: '发现新版本，是否重启应用?',
						cancelColor: '#eeeeee',
						confirmColor: '#FF0000',
						success(res2) {
							if (res2.confirm) {
								updateManager.applyUpdate();
							} else {
								updateManager.applyUpdate();
							}
						}
					});
				});
			}
		});
		updateManager.onUpdateFailed(function(res) {
			// 新的版本下载失败
			uni.showModal({
				title: '提示',
				content: '检查到有新版本，但下载失败，请检查网络设置',
				success(res) {
					if (res.confirm) {
						updateManager.applyUpdate();
					}
				}
			});
		});
	}
};
</script>

<style>
@import '/wxcomponents/vant/common/index.wxss';
/*每个页面公共css */
@import 'colorui/main.css';
@import 'colorui/icon.css';

/*每个页面公共css */
page {
	height: 100%;
	font-family: pingfang, Avenir, Helvetica, Arial, sans-serif;
}

.content {
	height: 100%;
}

.uList {
	padding: 0rpx;
	display: block;
	margin-top: 5upx;
}

.uList .uniListItem {
	color: #1c1c1c;
	font-size: 30px;
	/*font-weight: 600;*/
}
</style>
