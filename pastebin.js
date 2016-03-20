const https = require('https');
const defaults = {
	option: 'paste',
	pasteCode: 'Hello World',
	pastePrivate: '1',
	pasteName: 'helloWorld.txt',
	pasteExpireDate: '10M',
	pasteFormat: 'text',
	userKey: ''
};

function Pastebin(apiKey) {
	this.apiKey = apiKey;
}

Pastebin.prototype.createPaste = function(config){
	var pthis = this;
	return new Promise((resolve, reject)=>{
		var data = {
			api_dev_key: pthis.apiKey,
			api_option: config.option || defaults.option,
			api_paste_code: encodeURIComponent(config.pasteCode || defaults.pasteCode),
			api_paste_private: config.pastePrivate || defaults.pastePrivate,
			api_paste_name: encodeURIComponent(config.pasteName || defaults.pasteName),
			api_paste_expire_date: config.pasteExpireDate || defaults.pasteExpireDate,
			api_paste_format: config.pasteFormat || defaults.pasteFormat,
			api_user_key: config.userKey || defaults.userKey			
		};
		data = Object.keys(data)
			.filter(el=>{
				return data[el];
			})
			.map(el=>{
				return `${el}=${data[el]}`;
			})
			.join('&');

		var options = {
			host: 'pastebin.com',
			port: 443,
			path: '/api/api_post.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'charset': 'UTF-8'
			}
		};
		
		var req = https.request(options, res=>{
			var data = '';
			res.setEncoding('utf8');
			res.on('data', chunk=>{
				data += chunk;
			});
			res.on('end', ()=>{
				resolve(data);
			});
		});

		req.on('error', err=>{
			console.log(err);
		});
		req.write(data);
		req.end();
	});
};

module.exports = Pastebin;