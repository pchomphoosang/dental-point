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

    app.fileInput = Backbone.Model.extend({
      defaults: {
           filename: '',
           filesize: ''
      }
    });

    app.UploadItem = Backbone.View.extend({

      template:_.template($('#UploadItem').html()),
      className:'template-upload fade in',
      tagName:'tr',

      initialize: function(attrs) {
        this.file = attrs.file;
        this.xhr = new XMLHttpRequest();
      },

      events:{
        'click .upload-img':'uploadwithProgress', 
        'click .cancel-img':'abort'
      },
      render: function() {
         $(this.el).html( this.template( this.model.toJSON() ));
         return this;
      },
      abort: function() {
        console.log("abort");
        this.xhr.abort();
        this.xhr.upload.addEventListener('abort', function(e) {
            that.$('.text-danger').append('<span class="label label-danger">Cancel Uploading</span>');
        });
      },
      uploadwithProgress: function ( ) {

              that = this;
              var formData = new FormData();

                        formData.append('photo', this.file);
                          
                        
                          
                        this.xhr.open('post', '/api/upload/img', true);
                          
                        this.xhr.upload.addEventListener('loadstart', function(e) {
                            that.$('.progress').removeClass('hide')
                        });

                        this.xhr.upload.addEventListener('progress', function(e) {
                          // While sending and loading data.
                            if (e.lengthComputable) {
                              var percentage = (e.loaded / e.total) * 100;
                              console.log("percentage :" + percentage);
                              that.$('.progress-bar').css('width', percentage + '%').text(percentage+'%');
                            }
                        });

                        this.xhr.upload.addEventListener('load', function(e) {
                          // When the request has *successfully* completed.
                          // Even if the server hasn't responded that it finished.
                          console.log("upload success");
                          that.$('.text-danger').append('<span class="label label-success">Finished upload</span>');
                          that.$('.upload-img').addClass('hide');
                        });

                        this.xhr.upload.addEventListener('error', function(e) {
                          // When the request has failed.
                          var err = 'An error occurred while submitting the form. Maybe your file is too big';
                          console.log("errror");
                          that.$('.text-danger').append('<span class="label label-danger">Error</span>');
                        });

                        this.xhr.send(formData);
          }
    });

    app.addUpload = Backbone.View.extend({

      template:_.template($('#UploadProviderFile').html()),
      className: "container",

      events:{
          'click #btn-pic-upload':'uploadfile',
          'change input#fileInput':'update'
      },

      render: function() {
          $(this.el).html( this.template());
          return this;
      },
      renderTable: function( ) {
           var file_ = $('input[name="fileInput"]')[0].files[0];
           console.log( file_ );
           var $tbody = this.$("tbody");
           //_.each(model,function(data){
                console.log("test");
                var obj = new app.fileInput({filename: file_.name,filesize:file_.size});
                $tbody.append( new app.UploadItem({model: obj,file: file_ }).render().el );
           //},this);
      },
      update: function(){

        this.renderTable( );
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

        showInfo: function(message) {
            $('.progress').addClass('hide');
            $('.alert').text(message).removeClass('hide');
        }

    });

    
/*--------------------------------------------------------------------------------- Router*/
  	var Router_upload = Backbone.Router.extend({
  
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


  	return Router_upload;
  });