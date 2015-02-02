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


    
    app.ProviderDetail = Backbone.Model.extend({
      url: '/api/providerDetail',
      defaults: {
           email:'',
           firstname: '',
           lastname: '',
           address1:'',
           address2:'',
           phone:'',
           cityofservice:'',
           specialist:'',
           service:[]
      },
      validate: function(attrs){
            /*var errors ={};
            var USER_RE = /^[a-zA-Z0-9_-]{3,20}$/;
            var PASS_RE = /^.{3,20}$/;

            if (!USER_RE.test(attributes.firstname)){
                errors['username_error'] = "invalid username. try just letters and numbers";
            }
            }*/

            var errors = [];
            if (!attrs.email) {
                errors.push({name: 'email', message: 'Please fill email field.'});
            }

            if (!attrs.firstname) {
                errors.push({name: 'firstname', message: 'Please fill firstname field.'});
            }
            if (!attrs.lastname) {
                errors.push({name: 'lastname', message: 'Please fill lastname field.'});
            }

            return errors.length > 0 ? errors : false;
      }

    });


    app.addView = Backbone.View.extend({

      template:_.template($('#AddProviderView').html()),
      className: "container",

      initialize: function() {
          that = this;
          this.model.on('invalid', function(model,errors){  // check a form input
                  that.showErr(errors);
          });
          this.render();
      },

      render: function() {
          $(this.el).html( this.template());
          this.stickit();
          return this;
      },

      bindings: {
        '#email': 'email',
        '#firstname': 'firstname',
        '#lastname': 'lastname'
      },

      events:{

          'click #btn-provider-info':'beforeSave',
          'click #btn-pic-upload':'uploadfile',
          'click .page-navigating':'handleHover',
          'click .dropdown-menu li':'handleDropdown'
      },

      handleDropdown: function(event){

          var $target = $( event.currentTarget );

          $target.closest( '.btn-group' )
            .find( '[data-bind="label"]' ).text( $target.text() )
            .end()
            .children( '.dropdown-toggle' ).dropdown( 'toggle' );
      },

      //------------------------------------ message manager-------------------//

      statusMsg: function(message) {

            $('.alert').text(message).removeClass('hide');
      },

      showErr: function(errors) {

          _.each(errors,function(error) {

              var $formgroup = $('.' + error.name);
              $formgroup .addClass('has-error');
              $formgroup.find('.form-control-feedback').removeClass('hide');
              $formgroup.find('.help-block').text(error.message);

          },this);
      },

      hideErrors: function () {

            $('.form-group').find('.form-control-feedback').addClass('hide');
            $('.form-group').removeClass('has-error');
            $('.form-group').find('.help-block').text('');

      },

      beforeSave: function () {

        event.preventDefault();

        // select the procedures
        $('#location').each(function() {   
                  console.log('location :'+$(this).text());
        });
        $('#specialist').each(function() {   
                  console.log('specialist : '+$(this).text());
        });
        var selected = [];

        $('#procedures option:selected').each(function() {   
            selected.push($(this).val());
        });

        console.log('2'+JSON.stringify(selected));
        console.log('3'+JSON.stringify(this.model));

        this.hideErrors();  // clear error field before 
        this.model.save({},{
          success: function(model, response){
            console.log('success'+JSON.stringify(response));
            this.$('#msg-provider').removeClass('hide');
          },
          error: function(){
            console.log('error');
          }
        });
      }
  });
/*
app.Model = Backbone.Model.extend({});

app.View = Backbone.View.extend({
  template:_.template($('#main').html()),
  className: "div",

  bindings: {
    '#test1': 'test1',
    '#value-test1': 'test1',
    '#test2': {
      observe:'test2',
      selectOptions: {
        collection: function() {
          return [
            {value: 0, label:'a'},
            {value: 1, label:'b'}
          ];
        }
      }
    },
    '#value-test2': 'test2'
  },

  render: function() {
    $(this.el).html( this.template()); 
     this.stickit();
     return this;
  }
});
*/

/*--------------------------------------------------------------------------------- Router*/
  	var Router_add = Backbone.Router.extend({
  
  		routes: {
            "": "addView",
            "on hold": "addView"

  		},

  		initialize: function () {
      		console.log('Initializing Router');
  		},

  		addView :function ( ) {

         console.log('#addView');


         var obj = new app.ProviderDetail({});
         var addview = new app.addView({model:obj});
         $( 'body' ).append( addview.el );


         $('#procedures').multiselect({
                     nonSelectedText: 'Choose Your Services!',
                     numberDisplayed: 15,
                     enableCaseInsensitiveFiltering: true
         });
  		},

  		upload : function() {

  		}
	});


  	return Router_add;
  });

              /*
          $('#btn-select').on('click', function() {
            var selected = [];
              $('#hello option:selected').each(function() {
                  selected.push([$(this).val()]);
              });
 
              selected.sort(function(a, b) {
                  return a[1] - b[1];
              });
 
              var text = '';
              for (var i = 0; i < selected.length; i++) {
                  text += selected[i][0] + ', ';
              }
              text = text.substring(0, text.length - 2);
 
              alert(selected);
            */
