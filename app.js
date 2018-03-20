var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var mysql = require('mysql');
var sleep = require('sleep');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'alarm',
    password : 'alarm',
    database : 'db_servo_log'
  });

connection.connect();

connection.query('SELECT * FROM servo_log', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
  });
  
  connection.end();

const SERVO_MAX = 1550;
const SERVO_MIN = 750;
const SERVO_DELAY_M = 5;

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

pwm = new Pca9685Driver(options, function(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Initialization done");
    
    for (i = 0; i < SERVO_MAX; i+=5) {
        // Set the pulse length to 1500 microseconds for channel 2
        pwm.setPulseLength(0, SERVO_MIN+i, 0, function() { 
            sleep.msleep(SERVO_DELAY_M);
            if (err){
                console.log('Could not set servo');
            }
        });
    }

    
    // Turn on channel 3 (100% power)
    pwm.channelOff(0);
});