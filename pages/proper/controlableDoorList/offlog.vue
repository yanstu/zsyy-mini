<template>
	<view class="gard">
		<view class="cu-bar bg-cyan solid-bottom margin-top" style="border-top-left-radius: 8px;
	border-top-right-radius: 8px;">
			<text style="margin: auto;font-size: 30rpx;">近30天的开门记录</text>
		</view>
		<view v-if="statusID" v-for="(items,index1) in socard" :key="index1">
			<view class="cu-timeline">
				<view class="cu-time" style="width:100px;">{{items.createtime || formatDate}}</view>
				<view class="cu-item text-blue">
					<view class="bg-blue content">
						<text>{{items.communityName}}</text>
						<text style="margin-left: 20px;">{{items.deviceName}}</text>
						<text class="margin-left text-yellow">{{items.type==1?'即时开门':'二维码开门'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="!statusID" style="text-align: center; margin-top:50%;">
			<view>
				<image src="https://kshht.gzmsdw.cn/imge_zsyy/html/pay/select.png" style="width: 40px; height: 40px;"></image>
			</view>
			<text class="text-cyan margin-top">你还没有使用记录哦~</text>
		</view>
		<view class="cu-bar bg-cyan solid-bottom crad">
			<text style="margin: auto;font-size: 26rpx;">我也是有底线的哦~</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				socard:null,
				statusID:false,
			}
		},
		//转发
		  onShareAppMessage: function() {
		    let users = wx.getStorageSync('user');
		    if (res.from === 'button') {}
		    return {
		     title: '码上到位',
		      path: '/pages/proper/door',
		      imageUrl:'', //这个是显示的图片，不写就默认当前页面的截图
		      success: function (shareTickets) {
		        console.info(shareTickets + '成功');
		        // 转发成功
		      },
		      fail: function (res) {
		        console.log(res + '失败');
		        // 转发失败
		      },
		      complete:function(res){
		        // 不管成功失败都会执行
		     }
		    }
		  },
		  onShow() {
		  	this.cradLog()
		  },
		  onLoad(option) {
		 var res = this.checkLogin('../proper/controlableDoorList/offlog','2');
		  if (!res){return false;}
		  	this.token = res
		  	this.cId=option.cId;
		  },
		  filters: {
		   formatDate: function(value) {
		    let date = new Date(value);
		    let y = date.getFullYear();
		    let MM = date.getMonth() + 1;
		    MM = MM < 10 ? ('0' + MM) : MM;
		    let d = date.getDate();
		    d = d < 10 ? ('0' + d) : d;
		    let h = date.getHours();
		    h = h < 10 ? ('0' + h) : h;
		    let m = date.getMinutes();
		    m = m < 10 ? ('0' + m) : m;
		    let s = date.getSeconds();
		    s = s < 10 ? ('0' + s) : s;
		    return y + '-' + MM + '-' + d + '' + h + ':' + m + ':' + s;
		   }
		  
		  },
		methods: {
			cradLog(){
				let that = this
				that.$req.request({
					url: 'api/community/findOpenDoorList',
					method: 'GET',
					data:{
						'communityId':-1,
						'doorId':-1,
						'type':-1
					},
					success: res => {
						that.socard = res.data.data
						if(res.data.code==200){
							this.statusID=true
						}else{
							uni.showToast({
								title:"哦吼服务器断线了~",
								icon: 'none'
							});
						}
					},
					complete:data=>{
					}
				})
			},
		}
	}
</script>

<style>
	.gard{
		/* border: 1px solid #000000; */
		width: 90%;
		margin-left: 5%;
		box-shadow: 0rpx 20rpx 10rpx 0rpx #92c7bf;
	}
	.crad{
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}

</style>
