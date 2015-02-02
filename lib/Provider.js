/* The ProjectsDAO must be constructed with a connected database object */
function ProviderDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof ProviderDAO)) {
        console.log('Warning: ProviderDAO constructor called without "new" operator');
        return new ProvidersDAO(db);
    }

    var provider = db.collection("provider");

    this.insertEntry = function (email, firstname, lastname, address1, address2, phone, cityofservice, specialist,service, callback) {
        "use strict";

        // Build a new project
        var newprovider = {
                           email:email,
                           firstname: firstname,
                           lastname: lastname,
                           address1:address1,
                           address2:address2,
                           phone:phone,
                           cityofservice:cityofservice,
                           specialist:specialist,
                           service:service
                      };

        // now insert the post
        provider.insert( newprovider , function( err , result){
        
              if(!err){
                 return callback(null, result[0]);
              }
              
              return callback(Error("insertProvider error"), null);
        });
    }

    // retrive  provider information based on serveral factors
    this.getProvider = function(num, callback) {
        "use strict";

        provider.find().sort('date', -1).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);
            console.log(items);
            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }

    this.getbyName = function(name, num, callback) {
        "use strict";

        posts.find({ name : name}).sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }

    this.getbyService = function(service, num, callback) {
        "use strict";

        posts.find({ service : service}).sort('date', -1).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }

    this.getbyService_location= function(service,location , num, callback) {
        "use strict";

        posts.find({ service : service}).sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " posts");

            callback(err, items);
        });
    }
    
}

module.exports.ProviderDAO = ProviderDAO;
