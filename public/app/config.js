require.config({   
    baseUrl: 'app',
    paths: {
        'jquery'     : 'libs/jquery-1.11.0',
        'jqm'        : 'libs/jquery.mobile-1.4.2/jquery.mobile-1.4.2',
        'underscore' : 'libs/underscore-min',
        'backbone'   : 'libs/backbone',
        'bootstrap'  : 'libs/bootstrap.min', 
        'bootstrap-multiselect'  : 'libs/bootstrap-multiselect', 
        'text'       : 'libs/text',
        'NProgress'  : 'libs/nprogress',
        'stickit'    : 'libs/backbone.stickit'
    },

    shim: {
        'underscore' : { exports : '_' },
        'backbone'   : { deps : ['underscore', 'jquery'], exports : 'Backbone' },
        'stickit'   : { deps : ['underscore', 'jquery','backbone'], exports : 'stickit' },
        'bootstrap'  : { deps : ['jquery'], exports : 'bootstrap' },
        'bootstrap-multiselect'   : { deps : ['jquery', 'bootstrap'], exports : 'bootstrap-multiselect' },
        'epoxy'   : { deps : ['jquery', 'backbone', 'underscore'], exports : 'epoxy' }

    }

});

require(['jquery','backbone','views/SearchView','router_search'], function($, Backbone, SearchView, Router_search) {

  var router = new Router_search();
  Backbone.history.start();
});

