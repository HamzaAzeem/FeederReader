define([
	'events', 'zepto', 'app/routes'
], function(events, $, routes) {
	var app = events(),
		alternateBaseUrl = '/apps/APP-NAME/';	// switch from "/" to this base if detected
	
	function init() {
		routes.options.viewBase = $('#main');
		
		updateBaseHref();
		routes.on('route', handleRouteChange);
		routes.init(location.pathname.replace(/(^|\/)index\.html$/gi,'/'));
		
		app.emit('init');
	}
	
	// Try to make <base href="/" /> less annoying
	function updateBaseHref() {
		var base = [].pop.call(document.getElementsByTagName('base')),
			u = base && base.href && base.href.replace(/\/*([?#].+)?$/g,'') + '/';
		if (u && u===alternateBaseUrl) {
			base.setAttribute('href', alternateBaseUrl);
		}
	}
	
	// Update menu when the url changes
	function handleRouteChange(e) {
		$('#menu .selected').removeClass('selected');
		$('#menu a[href^="/#/"]').each(function(i, node) {
			var href = node.getAttribute('href').replace(/^\/?#?\/?/g,'/');
			$('body').removeClass('menu-open');
			//if (routes.isUrlActive(href)) {
			if (e.rawUrl===href || e.url===href) {
				$(node).parent().addClass('selected');
			}
		});
	}
	
	// lazy init on page load:
	$(init);
	
	return app;
});