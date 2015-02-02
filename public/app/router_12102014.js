
define([
  'jquery',
  'underscore',
  'backbone',
  'views/SearchView'
  ],function($ , _ ,Backbone,SearchView) {


    
    var ProviderList = Backbone.Collection.extend({
      model: Provider,
      sync: function(method, model, options) {
        if (method === "read") {
           
        }
      }

    });

    var ProviderListView = Backbone.View.extend({
        el:'SearchProvider',

        initialize: function() {
          this.collection = new ProviderList(initialProvider);
          this.render();
          this.listenTo(this.collection, 'add');
        },

        events:{
          'click #get':'Search'
        },

        Search: function() {

        },

        render: function() {

        },
        renderProvider: function( item ) {
            var provider = new 
           $('.features_items').append();
        }


    });

    var ProviderView = Backbone.View.extend({
    
        template:_.template($('#tpl-provider').html()),
        tagName: 'div',
        classname: "col-sm-8",

        initialize: function() {
          this.model.on("change", this.render);
          this.render();
        },

        render: function() {
          $(this.el).html( this.template(this.model.toJSON()));
          return this;
        }
    });

    var Provider = Backbone.Model.extend({

      default: {
           coverImage: '',
           name: ' ',
           service:'',
           address:' '
      },

      initialize:function () {

      }

    });


  	var Router = Backbone.Router.extend({
  
  		routes: {
            " ": "SeachView",
            "login": "login"
  		},

  		initialize: function () {
      		console.log('Initializing Router');

          var  p1 = new Provider({
           name: 'Dr. Amy Jones',
           service:'Obstetrician & Gynaecologist',
           address:'3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510',
           coverImage: 'pics/Amy_Jones.jpg'
          });

          this.Pview    = new ProviderView({model :p1});
      		//this.searchView  = new SearchView();    
      		//this.searchView.render();ß
      		$('#providerlist').append(this.Pview.el);  
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