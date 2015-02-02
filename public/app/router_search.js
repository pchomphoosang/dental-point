define([
  'jquery',
  'underscore',
  'backbone',
  'views/SearchView',
  'NProgress',
  'bootstrap',
  'bootstrap-multiselect',
  'stickit'
  ],function($ , _ ,Backbone,SearchView,NProgress) {

  var app = app || {};

/*--------------------------------------------------------------------------------- Model & Collections*/

    app.Provider = Backbone.Model.extend({
      defaults: {
           name: '',
           speciallist : ' ',
           service:'',
           address1:' ',
           address2:' ',
           contract:' ',
           coverImage:''
      }
    });

    app.ProviderList2 = Backbone.Collection.extend({
      model: app.Provider,
      url: "/search2"
    });

/*--------------------------------------------------------------------------------- Views*/

  
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
            this.current_page =1;
            that = this;
        },

        events:{

          'click #btnSearch':'Search',
          'click .page-navigating':'handleHover'
        },

        render: function() {

          $(this.el).html( this.template());
          return this;
        },

        Search: function() {

              event.preventDefault();
              console.log('Search..');

              var keysearch = this.$(".search-doc option:selected").text();
              var keylocation = this.$(".search-location option:selected").text();

              console.log("keysearch : "+keysearch);

              NProgress.start();  // loading progress // { data: $.param({ keyword: "hello"}) }
              this.model.fetch({
                    data   :{keyword :'hello'},
                    success: function(collection, response) {
                              this.model = collection;
                              that.ViewList("");
                              NProgress.done();
                    },
                    error  :   function (e) {
                              alert('Network is failing');
                    }
              });
              //NProgress.done();
        },

        ViewList: function(page) {

              console.log("page: "+page);
              var providers = this.model.models; // collection
              var len = providers.length;        // num of items
              var pageCount = Math.ceil(len / 6);  // number of page


              if ( page.indexOf('+') > -1 ) {

                  var page  = ((this.current_page +1)> pageCount) ? pageCount : (this.current_page +1);

              }else if ( page.indexOf('-') > -1 ){

                  var page  = ((this.current_page -1)< 0) ? 1 : (this.current_page -1);

              } 

              var page = page ? parseInt(page, 10) : 1;
              this.current_page = page;     // update current page

              var startPos = (page - 1) * 6;       
              var endPos = Math.min(startPos + 6, len);

              this.$('#providerlist').empty();
              this.$('#providerlist').append('<h2 class="title text-center">List of Doctors</h2>'+page);
          
              // insert provider each page
              for (var i = startPos; i < endPos; i++) {
                  this.$('#providerlist').append(new app.ProviderView({model :providers[i]}).render().el);
              }

              // insert page list
              this.$('#pagination-tp').empty();          
              this.$('#pagination-tp').append('<li><a class="page-navigating" navigator="-1" href="#">&laquo;</a></li>');
              for ( var i=0 ; i < pageCount; i++) {

                this.$('#pagination-tp').append("<li" + ((i + 1) === page ? " class='active'" : "") + "><a class='page-navigating' navigator='"+(i+1)+"'>" + (i+1) + "</a></li>");
              }
              this.$('#pagination-tp').append('<li><a class="page-navigating" navigator="+1" href="#">&raquo;</a></li');
        },

        // switch page around
        handleHover: function() {
            
              this.$(".page-navigating").click(function() {
                  NProgress.start(); 
                    var i = $(this).attr("navigator"); 
                    that.ViewList(i);
                  NProgress.done(); 
              });
           
        }

    });
    
/*--------------------------------------------------------------------------------- Router*/
  	var Router_search = Backbone.Router.extend({
  
  		routes: {
            "on hold": "addView",
            "": "search"

  		},

  		initialize: function () {
      		console.log('Initializing Router');

  		},

  		addView :function ( ) {


  		},

      search :function ( ) {

         console.log('#addView');


         //var col = new app.ProviderList2();
         //var searchview = new app.ProviderListView({ model:col });
         //$( 'body' ).append( searchview.render().el );

         var m = new app.Provider({
           name: 'pawat',
           speciallist : 'dog',
           service:'hh',
           address1:'1',
           address2:'1',
           contract:' 1',
           coverImage:'/api/dowload/img'
        });
         var searchview = new app.ProviderView({model:m});
         $( 'body' ).append( searchview.render().el );

      }
	});


  	return Router_search;
  });