require.config({
	baseUrl : 'js/lib',
	shim: {
		//lib : { exports: 'globalLibName' },
	},
	paths : {
		app : '../app',
		templates : '../../templates'
	}
});

define(['app/main'], function(main) {
	window.app = main;
});