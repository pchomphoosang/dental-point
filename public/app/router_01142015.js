
define([
  'jquery',
  'underscore',
  'backbone',
  'views/SearchView'
  ],function($ , _ ,Backbone,SearchView) {

  var app = app || {};
  this.MemoryStore = function (successCallback, errorCallback) {

    
    this.providers = [
        {"id": 1, "name": "Dr. Amy Jones", "specialist": "Prosthodontics", "service": "Detal Implent", 
         "address1": "Asok Montri Dental Clini(Asok) Road",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9", 
         coverImage: 'pics/Amy_Jones.jpg'
        },
        {"id": 2, "name": "Dr. Mike Jones", "specialist": "Endodontics","service": "cleaning ,polishing", 
         "address1": "Elizabeth Medical Centre Singapore 228510",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9",
          coverImage: 'pics/Gary_Donovan.jpg'
        },
        {"id": 3, "name": "Dr.Prapon Jim", "specialist": "Periodontics","service": "Obstetrician & Gynaecologist",
         "address1": "Elizabeth Medical Centre",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9",
         coverImage: 'pics/Kathleen_Byrne.jpg'},
        {"id": 4, "name": "Dr. John Williams", "specialist": "Oral and Maxillofacial Surgery","service": "Obstetrician & Gynaecologist",
         "address1": "Elizabeth Medical Centre Singapore 228510",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9",
         coverImage: 'pics/John_Williams.jpg'
        },
        {"id": 5, "name": "Dr. Jame King", "specialist": "Orthodontics","service": "Obstetrician & Gynaecologist",
         "address1": "Elizabeth Medical Centre Singapore 228510",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9",
         coverImage: 'pics/James_King.jpg'
       },
        {"id": 6, "name": "Dr. Sunee Chom","specialist": "Oral Surgery","service": "Implant Dentistry", 
         "address1": "Elizabeth Medical Centre",
         "address2": "Klongtoey Nua, Wattana, Bangkok 10110",
         "contract": "Tel 02-640-8188-9",
        coverImage: 'pics/Amy_Jones.jpg'},
    ];

    this.findByALL = function (searchKey, callback) {
        var providers = this.providers;
        callLater(callback, providers);
    }

    this.findByName = function (searchKey, callback) {
        var providers = this.providers.filter(function (element) {
            var fullName = element.name

            return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
        });

        callLater(callback, providers);
    }

    this.findById = function (id, callback) {
        var providers = this.providers;
        var provider = null;
        var l = providers.length;
        for (var i = 0; i < l; i++) {
            if (providers[i].id === id) {
                provider = providers[i];
                break;
            }
        }
        callLater(callback, provider);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    callLater(successCallback);
}

var localstore   = new MemoryStore();


/*--------------------------------------------------------------------------------- Model & Collections*/

    


    var ProviderList = Backbone.Collection.extend({
      model: app.Provider,
      sync: function(method, model, options) {
        if (method === "read") {
           localstore.findByALL('any keywords',function (data) {
              options.success(data);
           });
        }
      }

    });

    app.Provider = Backbone.Model.extend({
      defaults: {
           coverImage: '',
           name: ' ',
           service:'',
           address:' '
      }
    });

    app.ProviderList2 = Backbone.Collection.extend({
      model: app.Provider,
      url: "http://localhost:9997/search2"
    });

/*--------------------------------------------------------------------------------- Views*/

    app.HeaderView = Backbone.View.extend({
      template:_.template($('#header').html()),
        tagName: 'header',

        initialize: function() {
              this.render();
        },

        render: function() {
          $(this.el).html( this.template());
          return this;
        }

    });
  
    app.ProviderView = Backbone.View.extend({
        tagName: 'div',
        className: "col-sm-8",
        template:_.template( $( '#tpl-provider' ).html() ),

        events:{
          'click .provider-image-wrapper':'handleHover'
        },

        render: function() {

          this.$el.html( this.template( this.model.toJSON() ) );

          return this;
        },

        handleHover: function(){

          console.log('----');
        }
    });
    /** receive input from user and make a query to server and display on ProviderSubView**/
    app.ProviderListView = Backbone.View.extend({

        template:_.template($('#searchprovider').html()),
        tagName: 'div',

        initialize: function() {
              //this.providerlist = new ProviderList();
              this.render();
        },

        events:{
          'click #btnSearch':'Search'
        },

        Search: function(page) {
          //--------------------------------------------------------------------------------------//
          event.preventDefault();
          $('#providerlist').empty(); // empty List before add th
          console.log('test functions');
          var keysearch = 'XXX';
          var p = page ? parseInt(page, 10) : 1;
          var p = 1;
          this.model.fetch({
            success: function(collection, response) {
                   this.pagenumView = new app.ProviderSubView({model:collection, page: p});
            },
            error: (function (e) {
                alert('Network is failing');
            })
          });
          //--------------------------------------------------------------------------------------//
        },

        render: function() {
          $(this.el).html( this.template());
          return this;
        }

    });

    app.ProviderSubView = Backbone.View.extend({

        el: "#providerlist",

        initialize: function(attrs) {
              this.options = attrs;
              this.render();
        },

        events:{
          'click .page-navigating':'handleHover'
        },

        render: function() {

          var providers = this.model.models;
          var len = providers.length;
          var startPos = (this.options.page - 1) * 6;
          var endPos = Math.min(startPos + 6, len);

          $(this.el).empty();
          $(this.el).append('<h2 class="title text-center">List of Doctors</h2>');
          
          // insert provider each page
          for (var i = startPos; i < endPos; i++) {
            $(this.el).append(new app.ProviderView({model :providers[i]}).render().el);
          }
          // insert pagination
          this.pagenumView = new app.PaginationView({model:this.model, page: this.options.page});

          return this;
        },

        handleHover: function() {

           $(".page-navigating").click(function() {
              console.log("test :"+ $(this).attr("navigator"));
           });
           
        }

    });

    app.PaginationView = Backbone.View.extend({

        el: "#pagination-tp",

        initialize: function(attrs) {
          this.options = attrs;
          this.model.bind("reset", this.render, this);
          this.render();
        },
        /*events:{
          'click .page-navigating':'handleHover'
        },*/

        render: function() {
          $(this.el).empty();
          var len= this.model.models.length;
          var pageCount = Math.ceil(len / 6);

          $(this.el).append('<li><a navigator="-1" href="#">&laquo;</a></li>');
          for ( var i=0 ; i < pageCount; i++) {

            $(this.el).append("<li" + ((i + 1) === this.options.page ? " class='active'" : "") + "><a class='page-navigating' navigator='"+(i+1)+"'>" + (i+1) + "</a></li>");

          }
          $(this.el).append('<li><a navigator="+1" href="#">&raquo;</a></li');

          return this;
        },

        handleHover: function() {

           $(".page-navigating").click(function() {
              console.log("test :"+ $(this).attr("navigator"));
           });
           
        }

    });



    /*var PaginationView = Backbone.View.extend({

    		template:_.template($('#paginationTemp').html()),
        tagName: 'div',
        classname:'pagination pagination-centered',

        initialize: function() {
          this.model.bind("reset", this.render, this);
          this.render();
        },
        render: function() {
        	console.log(this.model.models);
          var len = this.model.length;
          var pageCount = Math.ceil( len / 5);
          console.log("this.len "+len+ " " + this.options);
          $(this.el).html('<ul />');

          for (var i=0; i < 5; i++) {
            $('ul', this.el).append("<li" + ((i + 1) === 1 ? " class='active'" : "") + "><a href='#provider/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
          }

          return this;
        }
    });*/


/*--------------------------------------------------------------------------------- Router*/
  	var Router = Backbone.Router.extend({
  
  		routes: {
            " ": "SeachView",
            "login": "login"
  		},

  		initialize: function () {
      		console.log('Initializing Router');
      		var collection1 = new app.ProviderList2();
          this.providerlistview = new app.ProviderListView({model:collection1});
          $( 'body' ).append( this.providerlistview.render().el );


         // var provider = new app.Provider({});
         // var pagenumView = new app.PaginationView();

         // $(' body' ).append( pagenumView.render().el );

  		},

  		SeachView :function ( ) {
  			console.log('#home');
  		},

  		login : function() {
  			console.log('#login page');
  		}
	});


  	return Router;
  });