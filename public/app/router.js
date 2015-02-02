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
           coverImage: '',
           name: ' ',
           service:'',
           address:' '
      }
    });

    app.ProviderList2 = Backbone.Collection.extend({
      model: app.Provider,
      url: "/search2"
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
            this.current_page =1;
            that = this;
            this.render();
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

              var keysearch = $(".search-doc option:selected").text();
              var keylocation = $(".search-location option:selected").text();

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

              $('#providerlist').empty();
              $('#providerlist').append('<h2 class="title text-center">List of Doctors</h2>'+page);
          
              // insert provider each page
              for (var i = startPos; i < endPos; i++) {
                  $('#providerlist').append(new app.ProviderView({model :providers[i]}).render().el);
              }

              // insert page list
              $('#pagination-tp').empty();          
              $('#pagination-tp').append('<li><a class="page-navigating" navigator="-1" href="#">&laquo;</a></li>');
              for ( var i=0 ; i < pageCount; i++) {

                $('#pagination-tp').append("<li" + ((i + 1) === page ? " class='active'" : "") + "><a class='page-navigating' navigator='"+(i+1)+"'>" + (i+1) + "</a></li>");
              }
              $('#pagination-tp').append('<li><a class="page-navigating" navigator="+1" href="#">&raquo;</a></li');
        },

        // switch page around
        handleHover: function() {
            
              $(".page-navigating").click(function() {
                  NProgress.start(); 
                    var i = $(this).attr("navigator"); 
                    that.ViewList(i);
                  NProgress.done(); 
              });
           
        }

    });
//------------------------------- //------------------------------- //-------------------------------   upload file
        app.util = {

          progressHandlingFunction: function (e){
              if(e.lengthComputable){
                  $('progress').attr({value:e.loaded,max:e.total});
              }
          },

          uploadFile: function (file, callbackSuccess) {
            var that = this;
            var data = new FormData();
            data.append('photo', file);
            $.ajax({
                url: 'api/upload/img',
                type: 'POST',
                xhr : function() {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload){ // Check if upload property exists
                        myXhr.upload.addEventListener('progress',that.progressHandlingFunction, false); // For handling the progress of the upload
                    }
                    return myXhr;
                },
                data: data,
                processData: false,
                cache: false,
                contentType: false
            })
            .done(function () {
                console.log(file.name + " uploaded successfully");
                callbackSuccess();
            })
            .fail(function () {
                //that.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
                alert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
            });
          }
    }

    app.ProviderDetail = Backbone.Model.extend({
      url: '/providerDetail',
      defaults: {
           email:'',
           firstname: '',
           lastname: '',
           address1:'',
           address2:'',
           phone:'',
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
            console.log("in model"+JSON.stringify(errors));
            return errors.length > 0 ? errors : false;
      }

    });
  //-----------------------------------------------------------------------------------------//upload
    app.fileInput = Backbone.Model.extend({
      defaults: {
           name: 'klang'
      }
    });

    app.UploadItem = Backbone.View.extend({
      template:_.template($('#UploadItem').html()),

      render: function() {
          $(this.el).html( this.template());
          return this;
      },

    });

    app.addUpload = Backbone.View.extend({

      template:_.template($('#UploadProviderFile').html()),
      className: "container",

      initialize: function() {

      },

      events:{
          'click #btn-pic-upload':'uploadfile',
          'change input#fileInput':'update'
      },

      render: function() {
          $(this.el).html( this.template());
          return this;
      },
      renderTable: function() {
           var $tbody = this.$("tbody");
           //_.each(model,function(data){
                console.log("test");
                var obj = new app.fileInput({name: 'klang.jep'});
                $tbody.append( new app.UploadItem({model: obj}).render().el );
           //},this);
      },
      update: function(){
        var file = $('input[name="fileInput"]')[0].files[0];
        console.log(file);
        this.renderTable();
      },
      uploadMsg: function(message) {

            $('.alert').text(message).removeClass('hide');
      },

      uploadfile: function(event) {

          var self = this;
          event.preventDefault();
          var file = $('input[name="fileInput"]')[0].files[0];

          if (file) {
              
              this.uploadwithProgress( file, function(error,data){

                    if ( error ) {
                      self.uploadMsg(error.error);
                    }
                    if ( data ) {
                      self.uploadMsg(data.message);
                      self.uploadcheck = true;
                    }
              });
              
          } else {
                self.uploadMsg("Please attach your image");
          }

        },

        uploadwithProgress: function (file,callback) {

              that = this;
              var formData = new FormData();

                        formData.append('photo', file);
                          
                        var xhr = new XMLHttpRequest();
                          
                        xhr.open('post', '/api/upload/img', true);
                          
                        xhr.upload.addEventListener('loadstart', function(e) {
                            $('.progress').removeClass('hide')
                        });
                        xhr.upload.addEventListener('progress', function(e) {
                          // While sending and loading data.
                            if (e.lengthComputable) {
                              var percentage = (e.loaded / e.total) * 100;
                              $('.progress-bar').css('width', percentage + '%').text(percentage+'%');
                            }
                        });
                        xhr.upload.addEventListener('load', function(e) {
                          // When the request has *successfully* completed.
                          // Even if the server hasn't responded that it finished.
                          callback( null , { message : "upload success" } );
                        });

                        xhr.upload.addEventListener('error', function(e) {
                          // When the request has failed.
                          var err = 'An error occurred while submitting the form. Maybe your file is too big';
                          callback( { error : err } , null );
                        });
                        xhr.upload.addEventListener('abort', function(e) {
                          // When the request has been aborted. 
                          // For instance, by invoking the abort() method.
                        });
                        xhr.send(formData);
          },

          showInfo: function(message) {
            $('.progress').addClass('hide');
            $('.alert').text(message).removeClass('hide');
          }

    });

    /////////////////////-----------------------------------------/////////////////////////////////////////////
    app.addView_log = Backbone.View.extend({

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

          return this;
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

        var input = {
              email:      $('#email').val(),
              firstname:  $('#firstname').val(),
              lastname:   $('#lastname').val(),
        };

        console.log('1'+JSON.stringify(input));
        console.log('2'+JSON.stringify(selected));

        this.hideErrors();  // clear error field before 
        this.model.save(input,{
            success: function () {
              alert('Thanks for the feedback!');
            },
            error: function (model,errors) {
              console.log(errors);
             }
        });
          /*var self = this;
          var check = this.model.validateAll();
          if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
          }
          */
          // Upload picture file if a new file was dropped in the drop area
          //if (this.pictureFile) {
            //this.model.set("picture", this.pictureFile.name);
          
          //var picture = $('input[name="fileInput"]')[0].files[0];
          //app.utils.uploadFile(picture, function () {
          //        console.log('upload..');
                    //self.saveProvider();
          //});

          //} else {
          //this.saveProvider();
          //}

        //return false;
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

          return this;
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

        var input = {
              email:      $('#email').val(),
              firstname:  $('#firstname').val(),
              lastname:   $('#lastname').val(),
        };

        console.log('1'+JSON.stringify(input));
        console.log('2'+JSON.stringify(selected));

        this.hideErrors();  // clear error field before 
        this.model.save(input,{
            success: function () {
              alert('Thanks for the feedback!');
            },
            error: function (model,errors) {
              console.log(errors);
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
  	var Router_holding = Backbone.Router.extend({
  
  		routes: {
            "on hold": "addView",
            "": "upload"

  		},

  		initialize: function () {
      		console.log('Initializing Router');
          /** test search **/
      		//var collection1 = new app.ProviderList2();
          //this.providerlistview = new app.ProviderListView({model:collection1});
          //$( 'body' ).append( this.providerlistview.el );
          //var model = new app.Model({test1: 'test', test2: 0});
          //var view = new app.View({model: model});
          //$( 'body' ).append( view.render().el);
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
        var file   = new app.fileInput({name:"klang"});
        var upload = new app.addUpload({model:file});
        $( 'body' ).append( upload.render().el );
        //var view = new app.BindingView({model: app.bindModel});
        //$( 'body' ).append( view.el );

  		}
	});


  	return Router_holding;
  });