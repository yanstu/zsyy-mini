import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import req from './config/index.js'
import fildata from './filters/index.js'
var log = require('./util/log.js');
Vue.component('cu-custom', cuCustom)

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.prototype.$req = req
Vue.prototype.$log = log
Vue.prototype.$fildata = fildata
Vue.config.productionTip = false

let userInfo = undefined
Vue.prototype.checkLogin = () => {
	var SUID = uni.getStorageSync('userList'); //用户 id, 
	if (SUID == '') {
		uni.redirectTo({
			url: '/pages/register/wxlogin'
		})
		return false;
	}
	return SUID.accessToken;
}

Vue.mixin({
	methods: {
		setTabBarIndex(index) {
			if (typeof this.$mp.page.getTabBar === 'function' &&
				this.$mp.page.getTabBar()) {
				this.$mp.page.getTabBar().setData({
					selected: index
				})
			}
		}
	}
})

Vue.prototype.sleep = (delay) => {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

Vue.prototype.isLogin = () => {
	var token = uni.getStorageSync('userList');
	if (token == '') {
		uni.showModal({
			title: '提示',
			content: '还未登录,请先登录',
			showCancel: true,
			cancelText: '否',
			confirmText: '去登录',
			success: res => {
				if (res.confirm) {
					uni.navigateTo({
						url: '/pages/register/wxlogin'
					})
				}
			}
		});
		return false
	} else {
		return true
	}
}

Vue.prototype.isBindXiaoQu = () => {
	if (!uni.getStorageSync('currC') || !uni.getStorageSync('currU')) {
		uni.showModal({
			title: '提示',
			content: '还未绑定当前小区，请前往"我的 -> 更换小区"',
			showCancel: true,
			cancelText: '不去',
			confirmText: '去切换',
			success: res => {
				if (res.confirm) {
					uni.switchTab({
						url: '/pages/user/user'
					})
				}
			}
		});
		return false
	} else {
		return true
	}
}

Vue.prototype.setMassage = (msg) => {
	getApp().globalData.message = msg
}

Vue.prototype.showMassage = () => {
	if (getApp().globalData.message) {
		uni.showToast({
			title: getApp().globalData.message,
			icon: getApp().globalData.message.indexOf('成功') != -1 ? 'success' : 'none',
			duration: 1500
		});
		getApp().globalData.message = ''
	}
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
