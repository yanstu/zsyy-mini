<template>
	<view>
		<view class="top">
			<text>到账银行卡号/支付宝账号</text>
			<van-field @focus="hindKeyboard" custom-style="text-indent: 2em;" clickable="true" placeholder="62xxxxxxxxxxxxxxxx" clearable />
		</view>
		<view class="page_box" @tap.stop="hindKeyboard">
			<view class="input_view" @tap.stop="hindKeyboard">
				<text class="title">提现金额</text>
				<view class="input_box" @tap.stop="showKeyboard">
					<text class="input_label">￥</text>
					<text class="content" v-if="content">{{ content }}</text>
					<view class="className" v-if="keyShow"></view>
					<text class="content place" v-if="!content">请输入金额</text>
				</view>
				<view class="tips">
					<text>当前余额</text>
					<text>{{ balance / 100 }}</text>
					<text>元，</text>
					<text @click="all">全部提现</text>
				</view>
			</view>
			<view :class="'keyboard' + (keyShow ? ' hind_box' : '')">
				<view class="key_box">
					<view class="number_box">
						<view v-for="(item, index) in KeyboardKeys" :key="index" :class="'keys ' + (index == 9 ? 'zero' : '')" @tap.stop="keyTap" :data-keys="item">
							{{ item }}
						</view>
					</view>
					<view class="btn_box">
						<view class="keys" @longpress="clearContent" @tap.stop="keyTap" data-keys="<">
							<image mode="widthFix" src="https://kshht.gzmsdw.cn/imge_zsyy/html/delete_icon.png"></image>
						</view>
						<view class="keys pay_btn" @tap.stop="payTap">提现</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import vanField from '@/wxcomponents/vant/field/index';
// #endif
// #ifdef MP-ALIPAY
import vanField from '@/components/vant/field/index';
// #endif
export default {
	components: {
		vanField
	},
	data() {
		return {
			content: '',
			KeyboardKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '·'],
			keyShow: true,
			balance: 0
		};
	},
	onLoad(option) {
		this.balance = option.balance;
	},
	methods: {
		all() {
			this.content = this.balance / 100;
		},
		clearContent(e) {
			console.log(e);
			if (e.currentTarget.dataset.keys == '<') {
				this.content = '';
			}
		},
		hindKeyboard() {
			var _this = this;
			_this.$scope.setData({
				keyShow: false
			});
		},

		showKeyboard() {
			var _this = this;

			_this.$scope.setData({
				keyShow: true
			});
		},
		keyTap(e) {
			var _this = this,
				keys = e.currentTarget.dataset.keys,
				len = _this.content.length;

			switch (keys) {
				case '·':
					if (len < 11 && _this.content.indexOf('.') == -1) {
						if (_this.content.length < 1) {
							_this.content = '0.';
						} else {
							_this.content += '.';
						}
					}
					break;
				case 0:
					if (_this.content.length < 1) {
						_this.content = '0.';
					} else {
						_this.content += '0';
					}
					break;
				case '<':
					_this.content = _this.content.substr(0, _this.content.length - 1);
					break;
				default:
					let Index = _this.content.indexOf('.');
					if (Index == -1 || len - Index != 3) {
						if (len < 11) {
							_this.content += keys;
						}
					}
					break;
			}
		},

		payTap() {
			var _this = this;
		}
	}
};
</script>
<style>
page {
	background: #ffffff;
	height: 100vh;
}
.top {
	padding-bottom: 20rpx;
	height: 180rpx;
	width: 100%;
	display: flex;
	flex-direction: column;
	background-color: #efedef;
}

.top text {
	margin: 20rpx 0px;
	margin-left: 10rpx;
	font-size: 26rpx;
}

.page_box {
	width: 100%;
	/* height: 100%; */
	background: #ededed;
	overflow: hidden;
}

.input_view {
	width: 100%;
	/* height:500rpx; */
	background: #fff;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	padding: 30rpx 60rpx 40rpx 60rpx;
	box-sizing: border-box;
}

.title {
	display: block;
	font-size: 24rpx;
	color: #000;
	padding-left: 10rpx;
}

.input_box {
	/* background: #ffc; */
	display: flex;
	padding: 20rpx 0;
	height: 140rpx;
	border-bottom: 1px solid #efefef;
}

.tips {
	margin-top: 20rpx;
	font-size: 24rpx;
	/* font-weight: lighter; */
}
.tips text:nth-of-type(4) {
	color: blue;
}

.input_label {
	font-size: 70rpx;
	font-weight: bold;
	margin-right: 5rpx;
}

.content {
	font-size: 70rpx;
	line-height: 90rpx;
	font-weight: bold;
	margin-top: 8rpx;
}

.content.place {
	font-size: 40rpx;
	color: #e2e2e2;
	font-weight: normal;
	margin-top: 8rpx;
}

.className {
	width: 6rpx;
	height: 66rpx;
	background: #43ad3f;
	border-radius: 6rpx;
	margin-top: 22rpx;
	animation: twinkling 1s infinite;
}

.animated {
	animation-duration: 1s;
	animation-fill-mode: both;
}

@-webkit-keyframes twinkling {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
.keyboard {
	height: 0;
	width: 100%;
	background: #f7f7f7;
	position: fixed;
	bottom: 0;
	left: 0;
	transition: height 0.3s;
	padding: 0 0 0 16rpx;
	z-index: 10;
}

.hind_box {
	height: 440rpx;
}

.key_box {
	overflow: hidden;
}
.number_box {
	width: calc((100% / 4 * 3) - 16rpx);
	display: inline-block;
}
.btn_box {
	width: calc(100% / 4);
	display: inline-block;
}
.keys {
	float: left;
	width: calc(100% / 3 - 16rpx);
	height: 90rpx;
	text-align: center;
	line-height: 90rpx;
	box-sizing: border-box;
	font-size: 40rpx;
	background: #fff;
	margin: 16rpx 16rpx 0 0;
	border-radius: 10rpx;
	font-weight: bold;
}
.keys.zero {
	width: calc((100% / 3) * 2 - 16rpx);
}
.keys image {
	width: 50rpx;
	height: auto;
}

.btn_box {
	width: calc((100% / 4));
}

.btn_box .keys {
	width: calc(100% - 16rpx);
	padding-top: 10rpx;
}

.btn_box .pay_btn {
	height: 298rpx;
	line-height: 298rpx;
	padding-top: 0;
	background: #05c160;
	font-size: 30rpx;
	color: #fff;
	font-weight: normal;
}
</style>
