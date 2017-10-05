var connect = require('connect');
var serveStatic = require('serve-static');

const serverPort = process.env.PORT || 9000;

connect().use(serveStatic(`${__dirname}`)).listen(serverPort, function(){
    console.log('Server running on 9000...');
});