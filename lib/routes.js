/*
* routes.js
*/
/* jslint         node : true,   continue : true,
   devel : true,  indent : 2,    maxerr : 50,
   newcap : true, nomen : true,  plusplus : true,
   reqexp : true, sloppy : true, vars : false,
   white : true
*/
//--------------BEGIN MODULE SCOPE VARAIABLES--------------
'use strict';
var SessionHandler = require('./SessionHandler');
//--------------END MODULE SCOPE VARAIABLES----------------


//--------------BEGIN PUBLIC METHODS--------------
exports.configRoutes = function(app, server,io, dbHandle){

    //var sessionHandler = new SessionHandler(dbHandle);
    
    // Middleware to see if a user is logged in
    //app.use(sessionHandler.isLoggedInMiddleware);
	/*app.get('/',function(request,response){
         response.redirect('/index.html');
	});*/

	//app.get('/login', sessionHandler.displayLoginPage);
    app.post('/login', sessionHandler.handleLoginRequest);
    app.post('/logout', sessionHandler.handleLoginLogoutRequest);
  
    app.post('/signup', sessionHandler.handleSignup);
    
    /*var clients = {};
    io.sockets.on('connection', function (socket) {
        clients[socket.id] = socket;
        console.log('socket.id'+socket.id);
        socket.on('message', function (message) {
            message= JSON.parse(message);
            console.log("Got message: " + message.message);
            //socket.emit('message',JSON.stringify(message));
            socket.broadcast.emit('message',message.message);
                //ip = socket.handshake.address.address;
                //url = message;
                //io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': '***.***.***.' + ip.substring(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
        });
 
        socket.on('disconnect', function () {
            console.log("Socket disconnected");
            //io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
        });
 
    }); */
    
};





