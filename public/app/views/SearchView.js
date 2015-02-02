define([
  'jquery',
  'underscore',
  'backbone',
  'text!tpl/SearchView.html'
  ], function($ , _ ,Backbone,searchView){

   var SearchView = Backbone.View.extend({
        tagname : "section",
        template:_.template(searchView),

        initialize:function () {
            console.log('Initializing SearchView');
        },
        
        events:{
            "click a[id=bloginfb]":"loginfb",
            "click #chatSendButton":"send"
        },

        render:function ( ) {
            $(this.el).html(this.template());
            return this;
        }
        
});

return SearchView; 
});