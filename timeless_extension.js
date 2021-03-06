//  Scratch extension for Raspberry Pi

new (function() {
    var ext = this;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };


    //  Getting from Raspberry Pi
    ext.gpioOn = function(gpio) {
        // Make an AJAX call to the WebIOPi API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/gpio/' + gpio + '/1',
              success: function(res) {
                  // Got the data - parse it and return the gpio status
                  console.log(res)
              }
        });

    };

    ext.gpioOff = function(gpio) {
        // Make an AJAX call to the WebIOPi API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/gpio/' + gpio +'/0',
              success: function(res) {
                  // Got the data - parse it and return the gpio status
                  console.log(res)
              }
        });

    };

    ext.gpiopwm = function(gpio, ratio) {
        // Make an AJAX call to the GPIO API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/pwm/' + gpio +'/ratio/' + ratio,
              success: function(res) {
                  // Got the data - parse it and return the gpio status
                  console.log(res)
              }
        });

    };

    ext.pwm4Write = function(duty1, duty2, duty3, duty4) {
        // Make an AJAX call to the GPIO API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/pwm4Write/' + duty1 + ',' + duty2 + ',' + duty3 + ',' + duty4,
              success: function(res) {
                  // Got the data - parse it and return the gpio status
                  console.log(res)
              }
        });

    };

    ext.gpioStatus = function(gpio, callback) {
        // Make an AJAX call to the GPIO API
        $.ajax({
              type: 'GET',
              url: 'http://127.0.0.1:5000/gpio/' + gpio + '/value',
              success: function(gpiodata) {
                  // Got the data - parse it and return the gpio status
                  res = JSON.parse(gpiodata)
                  console.log(res.value)
                  callback(res.value)
              }
        });

    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'ピン %m.gpio を ON', 'gpioOn', '25'],
            [' ', 'ピン %m.gpio を OFF', 'gpioOff', '25'],
            ['R', 'ピン %m.gpio の状態', 'gpioStatus', '25'],
            [' ', 'ピン %m.gpio を %n にする', 'gpiopwm', '25', '0'],
            [' ', 'モーター出力を %n %n %n %n にする', 'pwm4Write', '0', '0', '0', '0'],
        ],
        menus: {
            gpio: ['22', '23', '24', '25'],
        }
    };

    // Register the extension
    ScratchExtensions.register('追加機能', descriptor, ext);
})();
