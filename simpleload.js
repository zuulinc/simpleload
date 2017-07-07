/**
 * Load
 * Author	Demetri - https://github.com/dmetri333/
 * Author	Keith - https://github.com/kpjf
 * Website	https://github.com/zuulinc/simpleload
 */
window.Load = (function() {

	var stack = [],
		deferred = [],
		queue,
		errAt = 1000,
		doc = document,
		head = doc.getElementsByTagName('head')[0];
	
	function createElement(type, attributes) {
		var el = doc.createElement(type);

		for (var attr in attributes) {
			el.setAttribute(attr, attributes[attr]);
		}
		
		return el;
	}
	
	function loaded(loadedFile, isError) {
		if (null === queue) {
			return;
		}

		var i=0, 
			file = null,
			n = queue.items.length;
		
		if (queue && queue.items) {
			for (i; file=queue.items[i], i<n; i++) {
				if(loadedFile.indexOf(file) !== -1) {
					queue.items.splice(i, 1);
					break;
				}
			}
		}
		
		if (queue.items.length === 0) {
			if (queue.oncomplete) queue.oncomplete();
			if (stack.length > 0 || deferred.length > 0) fetch();
		}
	}

	function scriptLoaded() {		
		
		if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
			this.onreadystatechange = null;
			if (!this.callbackExecuted) {
				loaded(this.src);	
			}
			this.callbackExecuted = true;
			clearTimeout(this.timer);
		}
	}
	
	function fetch() {
	
		queue = stack.length > 0 ? stack.shift() : (deferred.length > 0 ? deferred.shift() : null);
		if (queue !== null) {
			if (typeof(queue.items) == 'function') {
				queue.items();
				fetch();
			} else {
				for (var i=0, file; file=queue.items[i], i<queue.items.length; i++) {
				
					var el = createElement('script', { src: file });
					el.timer = setTimeout((function(f){
						return function() {
							if (!this.callbackExecuted) {
								loaded(f, true);
							}
							this.callbackExecuted = true;
						};
					}(file)), errAt);

					el.onload = el.onreadystatechange = scriptLoaded;
					
					head.appendChild(el);
				}
			}
		}
	}
	
	function add(items, oncomplete, defer) {
		if (typeof(items)=='string') items = [items];
		if (defer === true) {
			deferred.push({
				items: items,
				oncomplete: oncomplete
			});
		} else {
			stack.push({
				items: items,
				oncomplete: oncomplete
			});
		}
		
	}
		
	return {
		get: function(items, oncomplete, deferred) {
			if (typeof(deferred)=='undefined') deferred = false;
			
			add(items, oncomplete, deferred);
			return this;
		},
		
		defer: function(items, oncomplete) {
			this.get(items, oncomplete, true);
			return this;
		},
		
		fetch: fetch
	};
	
})();
