/**	@module Generic model base class.
 *	@name model
 */
(function(factory, g) {
	g = g || this;
	if (typeof g.define === 'function' && g.define.amd) {
		g.define(['events', 'zepto', 'util'], factory);
	}
	else {
		factory(g.EventEmitter, g.$, g._);
	}
}(function(events, $, _) {
	var EventEmitter = events.EventEmitter || events;
	
	function isObject(obj) {
		return typeof obj==='object' && obj!==null;
	}
	
	/**	@class Generic server-synchronized Model base class.
	 *	@name model.Model
	 *	@augments events.EventEmitter
	 */
	function Model(obj) {
		if (!(this instanceof Model))
			return new Model(); 
		
		EventEmitter.call(this);
		this.items = obj || this._modelDefault;
	}
	
	_.inherits(Model, EventEmitter);
	
	_.extend(Model.prototype, /** @lends model.Model# */ {
		_noop : function() {},
		
		_modelDefault : [],
		
		/**	Get the value for a given key. If <code>key</code> is omitted, returns all values. */
		get : function (key) {
			return key ? this.items[key] : this.items;
		},
		
		/** alias of get(key) */
		getAt : function(index) {
			return this.get(index);
		},
		
		/**	Set the value for a given key. If <code>key</code> is an Object, it will be merged into the Model data. */
		set : function (key, val, force) {
			if (!key)
				return this;
			
			if (key && force) {
				this.items = key;
			}
			else if (isObject(key)) {
				_.extend(this.items, key);
			}
			else {
				this.items[key] = val;
			}

			this.trigger('update', this, this.items);
			return this;
		},
		
		/**	Push an object onto the model's list of items, if it is an Array. */
		add : function(obj) {
			if (!isObject(obj)) 
				return this;
			
			if (!Array.isArray(this.items)) {
				throw new Error('Cannot call add() on a non-Array model instance.');
			}
			
			this.items.push(obj);
			this.trigger('update', this, this.items);
			return this;
		},
		
		/**	Remove all model data. */
		reset : function() {
			return this.set(this._modelDefault, null, true);
		},
		
		/**	Remove an object (or an object at a given index) from the model's data. */
		destroyAt : function (index) {
			if (isObject(index))
				index = this.getIndex(index);
			index = Math.round(index);
			
			if (typeof index==='number' && index>=0) {
				this.items.splice(index, 1);
				this.trigger('destroy', this, this.items);
			}
			return this;
		},
		
		/**	Destroy the model instance. */
		destroy : function() {
			this.reset();
			this.trigger('destroy', this, this.items);
			return this;
		},
		
		
		/**	Get the numerical index of the given object within the model's root level list of items. */
		getIndex : function(obj) {
			var items = this.get(),
				keys = Object.keys(items);
			for(var i=keys.length; i--; ) {
				if (items[keys[i]] === obj) {
					return i;
				}
			}
			return -1;
		},
		
		/**	Update model using data from the server.
		 *	@param {Object} [reqData]		Optional request body data
		 *	@param {Function} callback		Called on completion: function(data, err, xhr)
		 */
		fetch : function(reqData, callback) {
			var self = this;
			callback = callback || this._noop;
			
			$.ajax({
				url : this.url,
				type : 'GET',
				data : reqData,
				success : function(data, status, xhr) {
					self.reset();
					self.fromJSON(data);
					callback.call(self, data, null, xhr);
					self.trigger('complete', self, self.get());
				},
				error : function(e, status, xhr) {
					var err = 'Model fetch() failed: ' + e;
					console.warn(err);
					callback.call(self, null, err, xhr);
				}
			});
		},
		
		/**	Send model data to the server.
		 *	@param {String} [httpMethod=PUT]	Optional method override.
		 *	@param {Function} callback			Called on completion: function(data, err, xhr)
		 */
		sync : function(httpMethod, callback) {			
			var self = this;
			
			if (typeof httpMethod==='function') {
				callback = httpMethod;
				httpMethod = callback;
			}
			callback = callback || this._noop;
			
			$.ajax({
				url : this.url,
				type : httpMethod || this.getDefaultSyncMethod(),
				data : this.toJSON(),
				success : function(data, status, xhr) {
					if (data===null || data===undefined) {
						data = true;
					}
					that.trigger('sync', this, data);
					callback.call(self, data, null, xhr);
				},
				error : function(e, status, xhr) {
					var err = 'Model sync() failed: ' + e;
					console.warn(err);
					callback.call(self, false, err, xhr);
				}
			});
		},
		
		/**	Returns "PUT" if there is an "id" data property, otherwise returns "POST". */
		getDefaultSyncMethod : function() {
			return this.get('id') ? 'PUT' : 'POST';
		},
		
		/**	Return current model data as a Plain Object */
		toObject : function() {
			return this.get();
		},
		
		/**	Parse the given object in preparation for being set as model data. Pass-thru by default. */
		parse : function(obj) {
			return obj;
		},
		
		/**	Serialize the model to a JSON string. */
		toJSON : function() {
			return JSON.stringify( this.toObject() );
		},
		
		/**	Populate the model from a JSON string. */
		fromJSON : function(json) {
			if (typeof json==='string') {
				json = JSON.parse(json);
			}
			this.set( this.parse(json) );
		},
		
		/**	Create a copy of this model. */
		clone : function() {
			return new this.prototype.constructor( this.get() );
		}
	});
	
	
	Model.Model = Model;
	
	return Model;
}, window));