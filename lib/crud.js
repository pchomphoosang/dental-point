/*
* crud.js  - module to provide CRUD db capabilities
*/
/* jslint         node : true,   continue : true,
   devel : true,  indent : 2,    maxerr : 50,
   newcap : true, nomen : true,  plusplus : true,
   reqexp : true, sloppy : true, vars : false,
   white : true
*/
//--------------BEGIN MODULE SCOPE VARAIABLES--------------
'use strict';
var 
loadSchema, checkSchema, 
checkType, constructObj,readObj,
updateObj, destroyObj, validateSignup,
handleSignup,handleNewProject,handleLoginRequest,

mongodb  =require('mongodb'),
fsHandle =require('fs'     ),
JSV      =require('JSV'    ).JSV,


mongoServer = new mongodb.Server(
   'localhost',
   mongodb.Connection.DEFAULT_PORT
),
dbHandle= new mongodb.Db(
   'crowd',mongoServer,{ safe : true}        // crowd is the name of database
);

//---begin extra functions--
var ProjectHandler  =require('./ProjectHandler');
var LoginHandler  =require('./SessionHandler');

var UsersDAO = require('./users').UsersDAO; 
var SessionsDAO = require('./sessions').SessionsDAO;

var users = new UsersDAO(dbHandle);
var sessions = new SessionsDAO(dbHandle);

var projectHandler = new ProjectHandler(dbHandle);
var loginHandler = new LoginHandler(dbHandle);
//---end extra functions--

//--------------END MODULE SCOPE VARAIABLES--------------

//--------------BEGIN UTILITY METHOD--------------

//--------------END UTILITY METHOD--------------

//--------------BEGIN PUBLIC METHODS--------------

//---begin generic methods




    


/*handleNewProject = function(req,callback){
       projectHandler.handleNewProject(req,function(err,result){
             if (!err) {
                console.log("Inserted new project in CRUD Level");
                return callback(null, result[0]);
            }
            return callback(err, null);
       });
};*/

//---end specific methods

module.exports = {
 makeMongoId : mongodb.ObjectID,
 checkType   : checkType,
 construct   : constructObj,
 read        : readObj,
 update      : updateObj,
 destroy     : destroyObj,
 singnup     : handleSignup,
 newproject  : handleNewProject,
 login       : handleLoginRequest
};
//--------------END PUBLIC METHODS--------------

//--------------BEGIN MODULE INITITAILZATION------------
dbHandle.open( function () {
  console.log( "** connected to MangoDB **" );
});

//--------------END MODULE INITITAILZATION--------------

