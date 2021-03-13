import baseurl from './request.js' //公共接口地址

// 请求封装
function request(obj) {
	let token = uni.getStorageSync('userList').accessToken
	let url = baseurl + obj.url; //地址
	let header = obj.header; //
	let data = obj.data || {};
	let success = obj.success;
	let fail = obj.fail;
	let complete = obj.complete;
	let method = obj.method || 'POST';
	uni.request({
		url: url,
		data: data,
		method: method,
		header: header || {
			'accessToken': token,
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		},
		success: (res) => {
			success(res)
		},
		fail: err => {
			console.log(err)
		},
		complete: (data) => {
			complete(data)
		}
	})
}

function synchro(obj) {
	return new Promise((resolve, reject) => {
		request({
			url: obj.url,
			method: obj.method || 'POST',
			data: obj.data || {},
			header: obj.header,
			success: res => {
				resolve(res);
			},
			complete: data => {}
		});
	});
}

function formatDate(value) {
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
	return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}

export default {
	request: request,
	formatDate: formatDate,
	synchro: synchro
};
