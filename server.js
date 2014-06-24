var http = require('http');
var Gpio = require('onoff').Gpio,
	led = new Gpio(14, 'out');

var i2c = require('i2c');
var address = 0x48;
var wire = new i2c(address, {device: '/dev/i2c-1', debug: false}); // point to your i2c address, debug provides REPL interface

var data = [];

setInterval(function () {
	wire.readBytes(0, 2, function (err, res) {
		if (err) {
			console.log(err);
			throw err;
		}
		console.log("Analog gigrometer say: %d", res[1]);
		var date = new Date();
		data.push(date.valueOf() + ":" + res[1]);
	});

}, 1000 * 60 * 60 * 2); //Every 2 hour;

led.write(1, function (err) {
	if (err) throw err;

	setInterval(function () {
		led.read(function (err, value) {
			if (err) throw err;

			led.write(value == 0 ? 1 : 0, function (err) {
				if (err) throw err;
				setTimeout(function(){
					led.write(value == 0 ? 1 : 0, function (err) {
						if (err) throw err;
					});
				},100);

			});
		});

	}, 2000);
});

process.on('SIGINT', function exit() {
	led.unexport();
	process.exit();
});

http.createServer(function (request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end(data.join(';'));
	data = [];
}).listen(5000);