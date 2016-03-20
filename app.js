const fs = require('fs');
const CHUNK_SIZE = 0.48 * 1024 * 1024;
const buffer = new Buffer(CHUNK_SIZE);

const Pastebin = require('./pastebin');
var pastebin;

var start = function(config){
	var fileName = config[0].split('/').pop();
	var finalJSON = {};

	fs.open(config[0], 'r', (err, fd)=>{
		if(err) throw err;
		
		var read = function(part) {
			fs.read(fd, buffer, 0, CHUNK_SIZE, null, (err, size)=>{
				if(err) throw err;

				if(!size){
					return fs.close(fd, err=>{
						if(err) throw err;

						fs.writeFile(`data/${fileName}.json`, JSON.stringify(finalJSON, null, '\t'), err=>{
							if(err) throw err;

							console.log('Success!');
						});
					});
				}

				var data = size < CHUNK_SIZE ? buffer.slice(0, size) : buffer;				

				pastebin.createPaste({
					pasteCode: data,
					pasteName: `${fileName}.${part}`
				})
				.then(res=>{
					finalJSON[`${fileName}.${part}`] = res;					
					read(++part);
				})
				.catch(err=>{
					console.error(err);
				});
			});
		};
		read(0);
	});
};

try{
	pastebin = new Pastebin(fs.readFileSync('.env', 'utf-8'));
	
	if(process.argv.length < 3){
		return console.error('Error: Wrong arguments given');
	}

	process.argv.shift();
	process.argv.shift();

	start(process.argv);
}
catch(err){
	return console.error('Error: Missing .env file');
}