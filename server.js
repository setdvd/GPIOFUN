


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
		data.push(date.valueOf()+":"+res[1]);
	});

}, 1000); //Every our;


setInterval(function () {
	led.read(function (err, value) {
		if (err) throw err;

		led.write(value == 0 ? 1 : 0, function (err) {
			if (err) throw err;
		});
	});

}, 2000);

process.on('SIGINT', function exit() {
	led.unexport();
	process.exit();
});
