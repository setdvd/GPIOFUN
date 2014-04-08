var Gpio = require('onoff').Gpio,
	led = new Gpio(17, 'out');


	setTimeout(function(){
		led.read(function(err, value){
			if(err) throw err;
			led.write(value ? 0:1);
		});

	},1000);

//Some


process.on('SIGINT', function exit() {
	led.unexport();
	process.exit();
});