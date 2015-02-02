var redis = require("redis"),
client = redis.createClient();

/* The SessionsDAO must be constructed with a connected database object */
function SocketSessionsDAO( ) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof SocketSessionsDAO)) {
        console.log('Warning: SocketSessionsDAO constructor called without "new" operator');
        return new SocketSessionsDAO( );
    }


    this.setSocket = function(id,username, callback) {
         client.set(id,username);
    }

    this.getUsername = function(id, callback) {
        client.get(id, function (err, reply) {
               console.log(reply.toString()); // Will print `OK`
        });
        client.end();
    }
    
    this.removeUsername = function(id, callback) {
        client.get("foo_rand000000000000", function (err, reply) {
               console.log(reply.toString()); // Will print `OK`
        });
        client.end();
    }
}

module.exports.SocketSessionsDAO = SocketSessionsDAO;
