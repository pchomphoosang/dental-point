var bcrypt = require('bcrypt-nodejs');

/* The UsersDAO must be constructed with a connected database object */
function UsersDAO(dbHandle) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(dbHandle);
    }

    var users = dbHandle.collection("users");

    this.addUser = function(username, password, email, callback) {
        "use strict";

        // Generate password hash
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(password, salt);

        // Create user document
        var user = {'_id': username, 'password': password_hash};

        // Add email if set
        if (email != "") {
            user['email'] = email;
        }

        users.insert(user, function (err, result) {
            "use strict";

            if (!err) {
                console.log("Inserted new user");
                return callback(null, result[0]);
            }

            return callback(err, null);
        });
    }
    
    this.getUserbyid = function(user_id, callback) {
        "use strict";

        if (!user_id) {
            callback(Error("User not set"), null);
            return;
        }

        users.findOne({ '_id' : user_id }, function(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (!user) {
                callback(new Error("User: " + user + " does not exist"), null);
                return;
            }

            callback(null, user);
        });
    }
    
    this.getUserbyemail = function(email, callback) {
        "use strict";

        if (!email) {
            callback(Error("User not set"), null);
            return;
        }
        
        users.findOne({ 'email' : email }, function(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (!user) {
                callback(new Error("User: " + user + " does not exist"), null);
                return;
            }

            callback(null, user);
        });
    }
    
    this.getUserbyfacebookID = function(fb_id, callback) {
        "use strict";

        if (!fb_id) {
            callback(Error("User not set"), null);
            return;
        }

        users.findOne({ 'facebook' : fb_id }, function(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (!user) {
                callback(new Error("User: " + user + " does not exist"), null);
                return;
            }

            callback(null, user);
        });
    }
    
    this.UpdateUserbyemail = function(email,document, callback) {
        "use strict";

        if (!email) {
            callback(Error("User not set"), null);
            return;
        }
        
        if (document===null) {
            callback(Error("User not set"), null);
            return;
        }

        users.update({ 'email' : email }, document ,function(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (!user) {
                callback(new Error("User: " + user + " does not exist"), null);
                return;
            }

            callback(null, user);
        });
    }
    

    this.validateLogin = function(username, password, callback) {
        "use strict";

        // Callback to pass to MongoDB that validates a user document
        function validateUserDoc(err, user) {
            "use strict";

            if (err) return callback(err, null);
            
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                }
                else {
                    var invalid_password_error = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalid_password_error.invalid_password = true;
                    callback(invalid_password_error, null);
                }
   
            }
            else {
                var no_such_user_error = new Error("User: " + user + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                no_such_user_error.no_such_user = true;
                callback(no_such_user_error, null);
              
            }
        }

       users.findOne({ '_id' : username }, validateUserDoc);
    }
    
    this.getfriendslist = function(user_id, callback) {
        "use strict";

        // Create user document
        var query = {'_id': user_id};
        var projector = {'_id': 0,friend :1};

        users.findOne(query,projector, function (err, result) {
            "use strict";

            if (!err) {
                console.log("Inserted new user");
                res.send(user);
                return callback(null, result[0]);
            }

            return callback(err, null);
        });
    }
}

module.exports.UsersDAO = UsersDAO;
