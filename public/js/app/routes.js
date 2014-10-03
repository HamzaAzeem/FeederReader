define([
	'util', 'router', 'events',
	'./routes/rss'
], function(util, router, events) {
	var routes = router();
	
	// Auto-register the [4..n] arguments as routes
	for (var i=3; i<arguments.length; i++) {
		routes.get(arguments[i].url, arguments[i]);
	}
	
	// We use this as a way to define globals for use within routes:
	routes.options = {};
	
	routes.init = function(path) {
		// If a <base href="/" /> is present, have the router account for it:
		var base = [].pop.call(document.getElementsByTagName('base'));
		if (base && base.href) {
			routes.setBaseUrl(base.getAttribute('href'));
			console.log('Using baseUrl: ' + routes.baseUrl);
		}
		
		// Hook up links delegation to the router:
		document.body.addEventListener('createTouch' in document ? 'touchstart' : 'click', linkHandler);
		
		// Initialize the router with the page's current URL,
		// without adding a history entry and taking any baseUrl into account:
		router.Router.prototype.init.call(routes, path);
	};
	
	// Automatically route links to pages
	function linkHandler(e) {
		var t=e.target, href;
		do {
			href = t.nodeName==='A' && t.getAttribute('href');
			if (href && href.match(/^\/#/g)) {
				routes.route(href.replace(/^\/#\/*/g,'/'));
				e.preventDefault();
				return false;
			}
		} while ( (t=t.parentNode) );
	}
	
	return routes;
});
