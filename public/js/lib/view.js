(function(factory, g) {
	g = g || this;
	if (typeof window.define==='function' && window.define.amd) {
		window.define(['util', 'events', 'zepto', 'handlebars'], factory);
	}
	else {
		factory(g.util, g.EventEmitter, g.$, g.handlebars);
	}
}(function(_, events, $, handlebars) {
	var EventEmitter = events.EventEmitter || events;
	
	function View(tpl) {
		EventEmitter.call(this);
		this.rawView = tpl;
		this.doTemplate = handlebars.compile(this.rawView);
		this.readyView = null;
		this.base = $(document.createElement('div'));
	}
	
	_.inherits(View, EventEmitter);
	
	_.extend(View.prototype, {

		template : function(data) {
			if (this.doTemplate) {
				this.templateData = data;
				this.readyView = $(data && this.doTemplate(data) || this.rawView);
				this.base.html('').append(this.readyView);
				return this;
			}
			return false;
		},

		hookEvents : function(events) {
			if (this.readyView) {
				var sep, evt, selector, c, x;
				this.events = events;
				for (x in events) {
					if (events.hasOwnProperty(x)) {
						sep = x.split(' ');
						evt = sep[0];
						selector = sep.slice(1).join(' ');
						this.base.on(evt, selector, events[x]);
					}
				}
				return this;
			}
			return false;
		},
		
		insertInto : function(selector) {
			if (this.base) {
				$(selector).append(this.base);
				return this;
			}
			return false;
		},
		
		insertAfter : function(selector, noBase) {
			if (this.base) {
				if (noBase) {
					$(this.base).children().insertAfter($(selector));
					return this;
				}
				this.base.insertAfter($(selector));
				return this;
			}
		}
	});
	
	View.View = View;
	
	return View;
}, window));