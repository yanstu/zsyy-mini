Component({
	properties: {
		selected: {
			type: Number,
			value: 2
		},
		color: {
			type: String,
			value: '#989898'
		},
		selectedColor: {
			type: String,
			value: '#61B9E7'
		},
		fontSize: {
			type: Number,
			value: 26
		},
		borderStyle: {
			type: String,
			value: '#F8F7F8'
		},
		backgroundColor: {
			type: String,
			value: '#FFFEFF'
		},
		list: {
			type: Array,
			value: [{
					"pagePath": "/pages/service/service",
					"text": "智慧停车",
					"iconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/停车未.png",
					"selectedIconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/停车已.png"
				}, {
					"pagePath": "/pages/proper/proper",
					"text": "小区服务",
					"iconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/服务未.png",
					"selectedIconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/服务已.png"
				}, {
					"pagePath": "/pages/home/home",
					"text": "首页",
					"iconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/首页未.png",
					"selectedIconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/首页已.png"
				}, {
					"pagePath": "/pages/index/index",
					"text": "共享车位",
					"iconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/共享车位未.png",
					"selectedIconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/共享车位已.png"
				},
				{
					"pagePath": "/pages/user/user",
					"text": "我的",
					"iconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/我的未.png",
					"selectedIconPath": "https://kshht.gzmsdw.cn/imge_zsyy/html/tabber/我的已.png"
				}
			]
		}
	},
	data: {
		statusBarHeight: getApp().globalData.statusBarHeight
	},
	methods: {
		switchTab(e) {
			const {
				index,
				path
			} = e.currentTarget.dataset
			if (index === this.properties.selected) return
			wx.switchTab({
				url: path
			})
			this.showItem(index, path)
		},
		showItem(idx, path) {
			this.setData({
				selected: idx
			});
			const detail = {
				idx,
				path
			};
			const option = {
				bubbles: true,
				composed: true
			};
			this.triggerEvent('onTap', detail, option);
		}
	}
})
