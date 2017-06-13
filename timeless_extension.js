/* Extension demonstrating a blocking command block */
/* Sayamindu Dasgupta <sayamindu@media.mit.edu>, May 2014 */

new (function() {
    var ext = this;

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };


    //  Select location code
    function selectLocationCode(location) {
        switch (location) {
            case '東京':
                locCode = '130010';
                break;
            case '横浜':
                locCode = '140010';
                break;
            case 'さいたま':
                locCode = '110010';
                break;
            case '千葉':
                locCode = '120010';
                break;
            default:
                locCode = '130010';     // Default value is Tokyo.
        }

        return locCode;
    }

    //  Get weather function 
    //  Getting from livedoor weather API
    ext.get_weather = function(location, date, callback) {
        // Select location code
        locCode = selectLocationCode(location);

        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              url: 'http://127.0.0.1:5000/weather?city=' + locCode + '&date=' + date,
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  weather = JSON.parse(weather_data);
                  console.log(weather.telop)
                  callback(weather.telop);
              }
        });

        //return temperature
    };

    ext.get_temp = function(location, date, callback) {
                // Select location code
        locCode = selectLocationCode(location);

        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              url: 'http://127.0.0.1:5000/weather?city=' + locCode + '&date=' + date,
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  weather = JSON.parse(weather_data);
                  console.log(weather.maxtemp)
                  callback(weather.maxtemp);
              }
        });
    }

   ext.get_weatherDesc = function(location, date, callback) {
        // Select location code
        locCode = selectLocationCode(location);

        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              url: 'http://127.0.0.1:5000/weather?city=' + locCode + '&date=' + date,
              success: function( weather_data ) {
                  // Got the data - parse it and return the temperature
                  weather = JSON.parse(weather_data);
                  console.log(weather.description)
                  callback(weather.description);
              }
        });

        //return temperature
    };

    //  Get weather function 
    //  Getting from livedoor weather API
    ext.gpioOn = function(gpio) {
        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/gpio/' + gpio + '/1',
              success: function(res) {
                  // Got the data - parse it and return the temperature
                  console.log(res)
              }
        });

        //return temperature
    };

    ext.gpioOff = function(gpio) {
        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/gpio/' + gpio +'/0',
              success: function(res) {
                  // Got the data - parse it and return the temperature
                  console.log(res)
              }
        });

        //return temperature
    };

    ext.gpiopwm = function(gpio, ratio) {
        // Make an AJAX call to the GPIO API
        $.ajax({
              type: 'POST',
              url: 'http://127.0.0.1:5000/pwm/' + gpio +'/ratio/' + ratio,
              success: function(res) {
                  // Got the data - parse it and return the temperature
                  console.log(res)
              }
        });

        //return temperature
    };

    ext.gpioStatus = function(gpio, callback) {
        // Make an AJAX call to the livedoor Weather API
        $.ajax({
              type: 'GET',
              url: 'http://127.0.0.1:5000/gpio/' + gpio + '/value',
              success: function(gpiodata) {
                  // Got the data - parse it and return the temperature
                  res = JSON.parse(gpiodata)
                  console.log(res.value)
                  callback(res.value)
              }
        });

        //return temperature
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'GPIO %m.gpio を ON', 'gpioOn', '25'],
            [' ', 'GPIO %m.gpio を OFF', 'gpioOff', '25'],
            ['R', 'GPIO %m.gpio の状態', 'gpioStatus', '25'],
            [' ', 'GPIO %m.gpio を %n にする', 'gpiopwm', '25', '0'],
            ['R', '%m.location の %m.date のお天気', 'get_weather', '東京', '今日'],
            ['R', '%m.location の %m.date の最高気温', 'get_temp', '東京', '今日'],
            ['R', '%m.location の %m.date の天気概要', 'get_weatherDesc', '東京', '今日']
        ],
        menus: {
            gpio: ['22', '23', '24', '25'],
            location: ['東京', '横浜', 'さいたま', '千葉'],
            date: ['今日', '明日'],
        }
    };

    // Register the extension
    ScratchExtensions.register('追加機能', descriptor, ext);
})();