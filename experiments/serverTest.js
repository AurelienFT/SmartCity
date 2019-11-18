var mosca = require('mosca');
var settings = {
    port: 1883
}

var server = new mosca.Server(settings);

// Client connects
server.on('clientConnected', (client) => {
    console.log(`Client "${client.id}" connected.`);
});

// Client disconnects
server.on('clientDisconnected', (client) => {
    console.log(`Client "${client.id}" disconnected.`);
});
  
// Message recieved
server.on('published', (packet, client) => {
    if (!packet.topic.startsWith('$SYS/')) {
        console.log(`  Topic: ${packet.topic}`);
        console.log(`  Payload: ${packet.payload}`);
    }
});

var message = {
    topic: '/hello/world',
    payload: 'abcde', // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
};
setInterval(function () {
    server.publish(message, function() {
    console.log('done!');
})}, 5000);