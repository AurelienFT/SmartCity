var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', function () {
    client.subscribe('#');
    setInterval(function () {
        client.publish('onoff', 'Turn on the light');
        console.log('Message Sent');
    }, 5000);
});

client.on('message', function (topic, message) {
    context = message.toString();
    console.log(context)
})