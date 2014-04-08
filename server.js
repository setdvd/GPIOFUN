var Gpio = require('onoff').Gpio,
	led = new Gpio(14, 'out');


var i2c = require('i2c');
var address = 0x48;
var wire = new i2c(address, {device: '/dev/i2c-1', debug: false}); // point to your i2c address, debug provides REPL interface

wire.writeByte(3,function(err){
	if(err){
		console.log(err);
		 throw err;
	}

	setInterval(function(){
		wire.readBytes(0, 2, function(err, res) {
			console.log(err);
			console.log(res[1]);

			 led.write(res[1]<215? 0:1);
	 		// result contains a buffer of bytes
		});
	},500);


});





//	setInterval(function(){
//		led.read(function(err, value){
//			if(err) throw err;
//			console.log('fun %s', value);
//			led.write(value ? 0:1);
//		});
//
//	},1000);
//
//Some


 process.on('SIGINT', function exit() {
 	led.unexport();
 	process.exit();
 });
