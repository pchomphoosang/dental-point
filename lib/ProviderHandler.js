var url = require('url'), 
    ProviderDAO = require('./Provider').ProviderDAO,
    sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ProjectHandler must be constructed with a connected db */
function ProviderHandler (db) {
    "use strict";

    var providers = new ProviderDAO(db);


    this.AddProvider = function(req, res, next) {
        "use strict";

        var email = req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var address1 = req.body.address1;
        var address2 = req.body.address2;
        var phone = req.body.phone;
        var cityofservice = req.body.cityofservice;
        var specialist = req.body.specialist;
        var service = req.body.service;

        providers.insertEntry(
            email, firstname, lastname, address1, address2, phone, cityofservice, specialist,service,
            function(err, result) {
            "use strict";

            if (err) return next(err);

            //if (updated == 0) return res.redirect("/post_not_found");
            console.log(result);
            return res.json(result);
        });
    }

    this.UpdateProvider = function(req, res, next) {

    }

    this.handleSearch = function(req, res, next) {

            console.log("url   : "+req.url)
            console.log("query : "+req.query)
            console.log("body  : "+req.body)
            var url_parts = url.parse(req.url, true);
            var query = url_parts.query;
            console.log(query.keyword)
  
            providers.getProvider(1,function(err,items){
                if (err) return next(err);
                return res.json(items);

            });
    }


    this.displayPostNotFound = function(req, res, next) {
        "use strict";
        return res.send('Sorry, post not found', 404);
    }

}

module.exports = ProviderHandler;
