<!--本页面由uniapp切片工具生成，uni-app切片-可视化设计工具(一套代码编译到7个平台iOS、Android、H5、小程序)，软件下载地址：http://www.ymznkf.com/new_view_669.htm -->
<template>
	<view class="YmContent">
		<view class="problem_feedback_63">
			<view class="problem_feedback_20">
				<image v-on:click="problem_feedback_61_61_click()" src="https://kshht.gzmsdw.cn/imge_zsyy/html/problem_feedback_61_61.jpg" mode="scaleToFill"
				 border="0" class="problem_feedback_61"></image>
				<input placeholder="请输入遇到问题的关键词" :value="keyword" @input="keyword_input" class="keyword" />
			</view>
			<text decode="true" class="problem_feedback_21">常见问题</text>
			<view class="problem_feedback_60">
				<view v-for="(item_60, index) in (list_problem.length==0?list_60:list_problem) " :key="index" class="problem_feedback_22">
					<text decode="true" @tap="detailed" :data-content="item_60.title" class="title">{{ item_60.title }}</text>
					<image v-on:click="problem_feedback_24_24_click(item_60)" src="https://kshht.gzmsdw.cn/imge_zsyy/html/problem_feedback_24_24.jpg"
					 mode="scaleToFill" border="0" class="problem_feedback_24"></image>
				</view>
			</view>
		</view>

		<view class="loading">{{ loadingText }}</view>
		<view class="ymBbottom"></view>
	</view>
</template>

<script>
	import app from '../../App.vue';

	// 定义全局参数,控制数据加载
	var _self,
		page = 1,
		timer = null;

	export default {
		data() {
			return {
				loadingText: '',
				keyword: '', //遇到问题的关键词
				list_60: [{
						title: '如何解绑车辆？',
						content: '在小程序中，点击右下角【我的】-【车辆管理】，选择需要解绑车牌号码最右边编辑图表 -【解除绑定】即可',
						image: [
							'https://kshht.gzmsdw.cn/imge_zsyy/html/my/车辆管理.png',
							'https://kshht.gzmsdw.cn/imge_zsyy/html/my/车辆管理2.png']
					},
					{
						title: '停车费用问题？',
						content: '计费规则是由物业管理处规定并自行配置，码上到位仅为实现既定的计费规则提供技术支持服务'
					},
					{
						title: '如何使用优惠券？',
						content: '在联网可线上缴费的停车场停车，缴费时，需选择使用优惠券方可使用'
					},
					{
						title: '如何索取发票？',
						content: '需出场时向岗亭索取发票，或到车场物业管理处报车牌索取发票。电子发票目前需要车场开通，看不到待开发票的，说明车场尚未开通电子发票。我们正在推广更多车场支持电子发票，目前很多车场还是传统纸质发票，支持电子发票的车场在逐步开通中。'
					},
					{
						title: '如何查询线上缴费记录？',
						content: '在小程序【首页】右下角，点击【我的】-【缴费记录】即可查询',
						image: ['https://kshht.gzmsdw.cn/imge_zsyy/html/my/缴费记录.png',
								'https://kshht.gzmsdw.cn/imge_zsyy/html/my/缴费记录2.png'
								]
					}
				],
				list_problem: [],

				page: 0, //当前分页页码
				apiUrl: '', //后端接口地址
				id: '', //传值使用,方便存在本地的locakStorage
				del_id: '' //方便存在本地的locakStorage
			};
		},
		components: {},
		onLoad(options) {
			_self = this;

			//检查是否登录参考代码,需要用的时候，可以把注释取掉
			//if(this.checkLogin()==false){
			//	return;
			//}

			//this.getLaction();//得到gps

			this.page = 0;

			//检测有没有传入id参数
			if (options.id != null && options.id != '') {
				this.id = options.id;
			}
			//执行初始化,需要用的时候，可以把注释取掉
			//this.Refresh("init");
		},
		onShow() {
			console.log('on show');
			//if(this.checkLogin()==false){
			//	return;
			//}

			//执行初始化,需要用的时候，可以把注释取掉
			//this.Refresh("init");
		},
		onPullDownRefresh: function() {
			//下拉刷新的时候请求一次数据
			this.Refresh();
		},
		methods: {
			/**
			 * problem_feedback_24_24处理函数
			 * 数据绑定  data-index="{{index}}"
			 * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			 */
			problem_feedback_24_24_click: function(event) {},

			/**
			 * problem_feedback_61_61处理函数
			 * 数据绑定  data-index="{{index}}"
			 * 数据取值  var index = e.currentTarget.dataset.index; var cata = this.list_cata_list[index];
			 */
			problem_feedback_61_61_click: function(event) {},

			/**
			 * input处理函数
			 */
			keyword_input: function(event) {
				this.list_problem = []
				this.keyword = event.target.value;
				for (let i = 0; i < this.list_60.length; i++) {
					if (this.list_60[i].title.indexOf(this.keyword) >= 0) {
						this.list_problem.push(this.list_60[i]);
					}
				}
			},

			// 问题页面下级
			detailed(e) {
				console.log(e.currentTarget.dataset.content)
				for (let i = 0; i < this.list_60.length; i++) {
					if (e.currentTarget.dataset.content == this.list_60[i].title) {
						// this.list_60[i]
						uni.navigateTo({
							url: './problemDetailed?title=' + this.list_60[i].title + '&content=' + this.list_60[i].content + '&image=' + this.list_60[i].image
						});
						// break;
					}
				}

			},

			//刷新数据
			Refresh: function(_action) {
				//提交到服务器
				var that = this;
				var url = that.apiUrl + '{server_code_file_path}';
				console.log(url);
				uni.request({
					url: url, //后端接口地址，需要改成自己的接口地址
					data: {
						action: _action, //上传动作，如按钮点击会产生click动作，分页也会产生，在后端根据具体的动作来判断事件
						uid: that.getUid(), //上传用户id,在登录中获得
						//上传页面中的变量
						//定义变量---start
						keyword: that.keyword,

						//定义变量---end
						id: that.id, //上传id值，后端可以根据此值来操作当前id
						del_id: that.del_id, //在列表中删除按钮选中时，上传到有后端，进行删除操作
						page: that.page
					},
					method: 'GET',
					success: function(res) {
						//后端返回数据

						// 隐藏导航栏加载框
						uni.hideNavigationBarLoading();
						// 停止下拉动作
						uni.stopPullDownRefresh();

						// 隐藏加载框
						uni.hideLoading();

						var tmp = res.data;

						//初始化，对页面上的控件进行赋值操作
						if (_action == 'init') {}

						{
							deal_listpages;
						}

						that.keyword = tmp.keyword;

						//如果后端有返回消息，则弹出消息提示
						if (tmp.message != null && tmp.message != '') {
							uni.showToast({
								title: tmp.message,
								icon: 'none',
								duration: 2000
							});
						}

						//如果后端有返回页码，则更改当前页码
						if (tmp.page != null && tmp.page != '') {
							page = tmp.page;
						}
					},
					fail: function(res) {
						uni.showToast({
							title: '服务器访问失败',
							icon: 'none',
							duration: 2000
						});
						console.log(res.data);
						console.log('is failed');
					}
				});
			}
		}
	};
</script>

<style>
	.YmContent {
		height: 100%;
		width: 100%;
	}

	button::after {
		border: none;
		width: auto;
	}

	input {
		outline: none;
		border: none;
		list-style: none;
		width: auto;
	}

	.list_item {
		float: left;
	}

	.ym_hide {
		display: none;
	}

	.ym_show {
		display: block;
	}

	.slide-image {
		width: 100%;
		height: 100%;
	}

	.list_horizontal {
		width: auto;
		display: inline-block;
	}

	.problem_feedback_63 {
		white-space: normal;
		width: 749rpx;
		height: 100%;
		padding: 0rpx;
		clear: both;
		float: left;
		border-radius: 0rpx;
		font-size: 8rpx;
	}

	.problem_feedback_63 .problem_feedback_20 {
		white-space: normal;
		width: 700rpx;
		height: 84rpx;
		padding: 0rpx;
		clear: both;
		margin-top: 15rpx;
		margin-left: 24rpx;
		float: left;
		background-color: #ededed;
		border-radius: 20rpx;
		font-size: 8rpx;
	}

	.problem_feedback_63 .problem_feedback_20 .problem_feedback_61 {
		white-space: normal;
		width: 32rpx;
		height: 40rpx;
		padding: 0rpx;
		margin-top: 22rpx;
		margin-left: 24rpx;
		float: left;
		border-radius: 0rpx;
		font-size: 39rpx;
		line-height: 40rpx;
	}

	.problem_feedback_63 .problem_feedback_20 .keyword {
		white-space: normal;
		width: 593rpx;
		height: 60rpx;
		min-height: 60rpx;
		padding: 0rpx;
		margin-top: 12rpx;
		margin-left: 21rpx;
		float: left;
		border-radius: 0rpx;
		color: #646464;
		font-size: 29rpx;
		line-height: 60rpx;
		background-color: #EDEDED;
	}

	.problem_feedback_63 .problem_feedback_21 {
		white-space: normal;
		width: 122rpx;
		height: 25rpx;
		padding: 0rpx;
		clear: both;
		margin-top: 47rpx;
		margin-left: 49rpx;
		float: left;
		border-radius: 0rpx;
		color: #c8c8c8;
		font-size: 24rpx;
		line-height: 25rpx;
	}

	.problem_feedback_63 .problem_feedback_60 {
		white-space: normal;
		width: 749rpx;
		min-height: 900rpx;
		padding: 0rpx;
		clear: both;
		margin-top: 16rpx;
		margin-left: 0rpx;
		float: left;
		border-radius: 0rpx;
		font-size: 8rpx;
	}

	.problem_feedback_63 .problem_feedback_60 .problem_feedback_22 {
		white-space: normal;
		width: 651rpx;
		height: 33rpx;
		padding: 0rpx;
		margin-top: 45rpx;
		margin-left: 48rpx;
		float: left;
		border-radius: 0rpx;
		font-size: 27rpx;
		line-height: 33rpx;
	}

	.problem_feedback_63 .problem_feedback_60 .problem_feedback_22 .title {
		white-space: normal;
		width: 562rpx;
		height: 33rpx;
		padding: 0rpx;
		margin-top: 0rpx;
		margin-left: 0rpx;
		float: left;
		border-radius: 0rpx;
		color: #1C1C1C;
		font-size: 29rpx;
		line-height: 33rpx;
	}

	.problem_feedback_63 .problem_feedback_60 .problem_feedback_22 .problem_feedback_24 {
		white-space: normal;
		width: 15rpx;
		height: 27rpx;
		padding: 0rpx;
		margin-top: 1rpx;
		margin-left: 72rpx;
		float: left;
		border-radius: 0rpx;
		font-size: 20rpx;
		line-height: 27rpx;
	}

	.problem_feedback_63 .btSubmit {
		white-space: normal;
		width: 200rpx;
		height: 74rpx;
		padding: 0rpx;
		clear: both;
		margin-top: 16rpx;
		margin-left: 274rpx;
		float: left;
		background-color: #0097fc;
		text-align: center;
		justify-content: center;
		border-radius: 20rpx;
		color: #ffffff;
		font-size: 20rpx;
		line-height: 74rpx;
	}
</style>
