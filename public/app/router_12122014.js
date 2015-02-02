
define([
  'jquery',
  'underscore',
  'backbone',
  'views/SearchView'
  ],function($ , _ ,Backbone,SearchView) {


  this.MemoryStore = function (successCallback, errorCallback) {

    
    this.providers = [
        {"id": 1, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
        {"id": 2, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
        {"id": 3, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
        {"id": 4, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
        {"id": 5, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
        {"id": 6, "name": "Dr. Amy Jones", "service": "Obstetrician & Gynaecologist", "address": "3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510", coverImage: 'pics/Amy_Jones.jpg'},
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

    var ProviderList = Backbone.Collection.extend({
      model: Provider,
      sync: function(method, model, options) {
        if (method === "read") {
           localstore.findByALL('any keywords',function (data) {
              options.success(data);
           });
        }
      }

    });

    var ProviderList2 = Backbone.Collection.extend({
      model: Provider,
      sync: function(method, model, options) {
        if (method === "read") {
           localstore.findByALL('any keywords',function (data) {
              options.success(data);
           });
        }
      }

    });

/*--------------------------------------------------------------------------------- Views*/

    var HeaderView = Backbone.View.extend({
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
  
    var ProviderView = Backbone.View.extend({
    
        template:_.template($('#tpl-provider').html()),
        tagName: 'div',
        classname: "col-sm-8",

        initialize: function() {
          this.render();
        },

        render: function() {
          $(this.el).html( this.template(this.model.toJSON()));
          return this;
        }
    });

    var ProviderListView = Backbone.View.extend({

        template:_.template($('#searchprovider').html()),
        tagName: 'div',

        initialize: function() {
              this.providerlist = new ProviderList();
              this.render();
        },

        events:{
          'click #btnSearch':'Search'
        },

        Search: function(event) {

          event.preventDefault();
          $('#providerlist').empty(); // empty List before add th
          console.log('test functions');
          var keysearch = 'XXX';
          this.providerlist.fetch({
            success : function(data){
                  var max = data.models.length;
                  for(var i =0; i< max; i++){
                      var  m = new Provider(data.models[i].attributes);
                      var  p   = new ProviderView({model :m});
                      $('#providerlist').append(p.render().el);  
                  }
            }
          });
        },

        render: function() {
          $(this.el).html( this.template());
          return this;
        }

    });

/*--------------------------------------------------------------------------------- Router*/
  	var Router = Backbone.Router.extend({
  
  		routes: {
            " ": "SeachView",
            "login": "login"
  		},

  		initialize: function () {
      		console.log('Initializing Router');
          this.headerview       = new HeaderView();
          this.providerlistview = new ProviderListView();
          //$('body').append(this.headerview.el);
          $('body').append(this.providerlistview.el);

          /*var j = new ProviderList();
          j.fetch({success:function(data){
            console.log('test'+JSON.stringify(data));
          },
          error:function(msg){
            console.log('test'+msg);
          }});
          */

          /*var  p1 = new Provider({
           coverImage: 'pics/Amy_Jones.jpg',
           name: 'Dr. Amy Jones',
           service:'Obstetrician & Gynaecologist',
           address:'3 Mount Elizabeth #11-07 Mount Elizabeth Medical Centre Singapore 228510'
          });

          this.Pview    = new ProviderView({model :p1}); */

      		//this.searchView  = new SearchView();    
      		//this.searchView.render();
      		//$('#providerlist').append(this.Pview.el);  

          //var listview = new ProviderListView();
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