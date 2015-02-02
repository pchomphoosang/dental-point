var UsersDAO = require('./users').UsersDAO
  , SessionsDAO = require('./sessions').SessionsDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler (db) {
    "use strict";

    var users = new UsersDAO(db);
    var sessions = new SessionsDAO(db);

    this.isLoggedInMiddleware = function(req, res, next) {
        var session_id = req.cookies.session;
        console.log("user session_id : " +session_id);
        sessions.getUsername(session_id, function(err, username) {
            "use strict";
        
            if (!err && username) {
                req.username = username;
            }
            console.log("user req.username : " +req.username);
            return next();
        });
    }

    this.displayLoginPage = function(req, res, next) {
        "use strict";
        return res.render("login", {username:"", password:"", login_error:""})
    }

    this.handleLoginRequest = function(req, res, next) {
        "use strict";

        var username = req.body.username;
        var password = req.body.password;

        console.log("user submitted username: " + username + " pass: " + password);

        users.validateLogin(username, password, function(err, user) {
            "use strict";

            if (err) {
                if (err.no_such_user) {
                    return res.send({username:username, password:"", login_error:"No such user"});
                }
                else if (err.invalid_password) {
                    return res.send({username:username, password:"", login_error:"Invalid password"});
                }
                else {
                    // Some other kind of error
                    return next(err);
                }
            }

            sessions.startSession(user['_id'], function(err, session_id) {
                "use strict";

                if (err) return next(err);
                console.log("user---sessions.startSession----"+session_id+"  >> "+JSON.stringify(user));
                res.cookie('session', session_id);
                return res.json(user);
            });
        });
    }

    this.handleLoginLogoutRequest = function(req, res, next) {
        "use strict";
      console.log("user logout------------");
        var session_id = req.cookies.session;
        sessions.endSession(session_id, function (err) {
            "use strict";

            // Even if the user wasn't logged in, redirect to home
            res.cookie('session', '');
            return res.send({ success: "User successfully logged out." });
        });
    }

    this.displaySignupPage =  function(req, res, next) {
        "use strict";
        res.render("signup", {username:"", password:"",
                                    password_error:"",
                                    email:"", username_error:"", email_error:"",
                                    verify_error :""});
    }

    function validateSignup(username, password, verify, email, errors) {
        "use strict";
        var USER_RE = /^[a-zA-Z0-9_-]{3,20}$/;
        var PASS_RE = /^.{3,20}$/;
        var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;

        errors['username_error'] = "";
        errors['password_error'] = "";
        errors['verify_error'] = "";
        errors['email_error'] = "";

        if (!USER_RE.test(username)) {
            errors['username_error'] = "invalid username. try just letters and numbers";
            return false;
        }
        if (!PASS_RE.test(password)) {
            errors['password_error'] = "invalid password.";
            return false;
        }
        if (password != verify) {
            errors['verify_error'] = "password must match";
            return false;
        }
        if (email != "") {
            if (!EMAIL_RE.test(email)) {
                errors['email_error'] = "invalid email address";
                return false;
            }
        }
        return true;
    }

    this.handleSignup = function(req, res, next) {
        "use strict";

        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var verify = req.body.verify;
        console.log("sigup email "+email +username+password+verify);
        // set these up in case we have an error case
        var errors = {'username': username, 'email': email}
        if (validateSignup(username, password, verify, email, errors)) {
            users.addUser(username, password, email, function(err, user) {
                "use strict";

                if (err) {
                    // this was a duplicate
                    if (err.code == '11000') {
                        errors['username_error'] = "Username already in use. Please choose another";
                        return res.send({function:"signup", error: errors});
                    }
                    // this was a different error
                    else {
                        return next(err);
                    }
                }

                sessions.startSession(user['_id'], function(err, session_id) {
                    "use strict";

                    if (err) return next(err);

                    res.cookie('session', session_id);
                    return res.send(user);
                });
            });
        }
        else {
            console.log("user did not validate");
            //return res.render("signup", errors);
            return res.send({function:"signup", err: errors});
        }
    }
    
    this.getfriendlist = function(req, res, next) {  // get friendlist
        "use strict";
        var user_id = req.body.username;
        users.getfriendlist(user_id,function(err, user){
            
        return res.send("welcome", {'username':req.username})
        })

        return res.send("welcome", {'username':req.username})
    }
    

    this.displayWelcomePage = function(req, res, next) {
        "use strict";

        if (!req.username) {
            console.log("welcome: can't identify user...redirecting to signup");
            return res.redirect("/signup");
        }

        return res.render("welcome", {'username':req.username})
    }
}

module.exports = SessionHandler;
