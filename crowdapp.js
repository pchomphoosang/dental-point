/*
* app.js
*/
/* jslint         node : true,   continue : true,
   devel : true,  indent : 2,    maxerr : 50,
   newcap : true, nomen : true,  plusplus : true,
   reqexp : true, sloppy : true, vars : false,
   white : true
*/
//--------------BEGIN MODULE SCOPE VARAIABLES--------------

var http=require('http'),
	express=require('express'),
	cors = require('cors'),
	routes = require('./lib/routes'),

	multer  = require('multer'),
	fs = require('fs'),
	finish = false,

	MongoStore = require('connect-mongo')(express),
	MongoClient  =require('mongodb').MongoClient,
	app = express(),
	
	server=http.createServer(app);
	
	//io = require('socket.io'),
	//io = io.listen(server);

var config = require('./config/config.js'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	SessionHandler = require('./lib/SessionHandler'),
	ProviderHandler = require('./lib/ProviderHandler');

var UsersDAO = require('./lib/users').UsersDAO;


//--------------END MODULE SCOPE VARAIABLES--------------


MongoClient.connect(config.db, function(err, dbHandle) {
	
	'use strict';
	if(err) throw err;
	console.log( "** connected to MangoDB **" );
	
		// serialize and deserialize
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
	
	// config
	var sessionHandler 	= new SessionHandler(dbHandle);
    var users 		   	= new UsersDAO(dbHandle);
    var providerHandler = new ProviderHandler(dbHandle);
    
	passport.use(new LocalStrategy({
    	usernameField: 'username',
    	passwordField: 'password'
  	},
  	function(username, password, done) {

	}
	));

	passport.use(new FacebookStrategy({
 		clientID: config.facebookAuth.clientID,
 		clientSecret: config.facebookAuth.clientSecret,
 		callbackURL: config.facebookAuth.callbackURL
	},
	function(req,accessToken, refreshToken, profile, done) {
	    console.log("Facebook Configuration: "+profile.id+" "+req.user+" "+profile._json.email);

			/*users.getUserbyfacebookID(profile.id, function(err, existingUser) {
      			if (existingUser) return done(null, existingUser);
      				users.getUserbyemail( profile._json.email , function(err, existingEmailUser) {
      			    console.log("---------------1");
                       if (existingEmailUser) {
                       	   console.log(" "+JSON.stringify(existingEmailUser));
                       		existingEmailUser.email = profile._json.email;
          					existingEmailUser.facebook = profile.id;

          					//existingEmailUser.tokens.push({ kind: 'facebook', accessToken: accessToken });
                            existingEmailUser['profile'] = { 'name' : profile.displayName};
          					//existingEmailUser.profile.name = profile.displayName;
          					existingEmailUser['profile'] = { 'gender' : profile._json.gender};
          					existingEmailUser['profile'] = { 'picture' :'https://graph.facebook.com/' + profile.id + '/picture?type=large'};
          					//existingEmailUser.profile.location = (profile._json.location) ? profile._json.location.name : '';
          					users.UpdateUserbyemail(existingEmailUser.email, existingEmailUser,function(err,UpdatedUser){
          						done(err, UpdatedUser);
          					}); 
          					//done(null, existingEmailUser);
                       }
                       //done(null, existingEmailUser);
      			   });
			});
             */
          
 		process.nextTick(function () {
   			return done(null, profile);
 		}); 
	}
	));
	
	
	//-------------BEGIN SERVER CONFIGURATION--------------
	// this configuration is set in every environment
	app.configure(function(){    
		
		/*Configure the multer.*/

		/*app.use(multer({ dest: './uploads/',
			rename: function (fieldname, filename) {
			    return filename+Date.now();
			  },
			onFileUploadStart: function (file) {
			  console.log(file.originalname + ' is starting ...')
			},
			onFileUploadComplete: function (file) {
			  console.log(file.fieldname + ' uploaded to  ' + file.path)
			  finish=true;
			}
		}));*/

		
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({
			resave: true,
  			saveUninitialized: true,
			secret: config.sessionSecret,
			store : new MongoStore({
				db: 'crowd',
				collection: 'sessions',
			})
		}));
		
		app.use(express.bodyParser());

		app.use(express.json());       // to support JSON-encoded bodies
		app.use(express.urlencoded()); // to support URL-encoded bodies


		app.use(passport.initialize());
		app.use(passport.session());
		
		
		
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));

	});
	
	//  how to set this config  e.g. node_ENV=development node app.js
	// if there is no setting, it will be call development by default
	app.configure('development',function(){  
		app.use(express.errorHandler());     
		app.use(express.logger());
		app.use(express.errorHandler({
       		dumpExceptions : true,
       		showStack      : true
		})  );
	});

	app.configure('production',function(){   //  how to set this config  e.g. node_ENV=production node app.js
		app.use(express.errorHandler());
	});
	
	app.get('/', function(req, res){
		//res.render('login', { user: req.user });
		res.redirect('/index.html');
	});
	
	
	//app.post('/login', sessionHandler.handleLoginRequest);
	//app.post('/login', ensureAuthenticated);
	
    //app.post('/logout', sessionHandler.handleLoginLogoutRequest);
    /*app.get('/logout', function(req, res) {
  			req.logout();
 
	});*/
  
    //app.post('/signup', sessionHandler.handleSignup);
    
    /*app.get('/auth/facebook', function(req, res){

		res.json(req.user);
	}); */
	/*
	app.get('/auth/facebook', passport.authenticate('facebook'));
	app.get('/auth/facebook/callback',passport.authenticate('facebook'),
		function(req, res) {
 		res.json(req.user);

	});
	*/
	app.get('/search2', providerHandler.handleSearch);

	/*app.post('/api/upload/img', function(req,res) { // upload picture and file
		console.log(JSON.stringify(req.files));
		if(finish==true){
    		console.log(req.files.photo);
    		//res.send('success');
  		}
	});*/

	//app.post('/api/providerDetail', function(req,res) { // upload picture and file
	//	console.log('------1'+JSON.stringify(req.body.email));
	//	console.log('------2'+JSON.stringify(req.body.firstname));
	//});
	//app.post('/api/providerDetail', providerHandler.AddProvider);

	/*app.get('/api/dowload/:img', function(req,res) { // dowload picture
        
        console.log("/api/dowload/:img :"+req.params.img);

        req.params.img = 'Amy_Jones501421738650467';

		fs.readFile('./uploads/'+req.params.img +'.jpg', function(error, data){ 
			if(error) { 
				res.writeHead(404); 
				res.end(); 
			} else { 
				res.writeHead(200, {'content-type': 'img/jpg'});
				res.end(data, 'binary'); } 
			}
		);

	});*/

	//app.use(sessionHandler.isLoggedInMiddleware);
	
	
	//routes.configRoutes(app, server,io,dbHandle);
	//-------------END SERVER CONFIGURATION--------------

	//-------------BEGIN START SERVER--------------
	server.listen(9997);


	console.log(
		'Express server listining on port %d in %s mode', 
        server.address().port, app.settings.env
	);
	
	function ensureAuthenticated(req, res, next) {
		console.log(" "+req.isAuthenticated()+" "+req.session ); 
		if (req.isAuthenticated()) { 
			console.log("yest"); 
			return next(); 
			
		}
		console.log("not yet"); 
		return next();
	}


});
//-------------END START SERVER--------------