var ProviderView = Backbone.View.extend({
    
	template:_template($('#tpl-provider').html()),

    initialize: function() {
		this.render();
	},

	render: function() {
     $(this.el).html(this.template(this.model.toJSON()));
     return this;
	}

});

var Provider = Backbone.Model.extend({

    default: {
        coverImage: 'pics/Amy_Jones.jpg',
    	name: '',
    	service:'',
    	address:'',
    },


    initialize:function () {

    }

});

var ProviderList = Backbone.Collection.extend({
    model: Provider
});