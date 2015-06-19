/**
 * Load
 * Author	Demetri - https://github.com/dmetri333/
 * Author	Keith - https://github.com/kpjf
 * Website	https://github.com/zuulinc/simpleload
 */
var Load = (function() {

	var stack = new Array(),
		deferred = new Array(),
		queue = new Array(),
		doc = document,
		head = doc.getElementsByTagName('head')[0],
		browser = null;
	
	function createElement(type, attributes) {
		var el = doc.createElement(type);
		
		for (var attr in attributes) {
			el.setAttribute(attr, attributes[attr]);
		}
		
		return el;
	};
	
	function loaded(loadedFile) {
		
		for (var i=0, file; file=queue.items[i]; i++) {
			if(~loadedFile.indexOf(file)) {
				queue.items.splice(i, 1);
				break;
			}
		}
		
		if (queue.items.length === 0) {
			if (queue.oncomplete) queue.oncomplete();
			if (stack.length > 0 || deferred.length > 0) fetch();
		}
		
	}
	
	function fetch() {
	
		queue = stack.length > 0 ? stack.shift() : (deferred.length > 0 ? deferred.shift() : null);
		if (queue !== null) {
		
			if (typeof(queue.items) == 'function') {
				queue.items();
				fetch();
			} else {
				for (var i=0, file; file=queue.items[i]; i++) {
				
					var el = createElement('script', { src: file });
					
					el.onload = el.onreadystatechange = function() {
						if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
							this.onreadystatechange = null;
							loaded(this.src);
						}
					};
					
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
