Simple Load
====

Simple Load is a small, dependency-free JavaScript utility that makes it super easy to load JavaScript files on demand.

Simple Load will automatically load resources in parallel while ensuring execution order when you specify an array of URLs to load.

Use Simple Load when you need a small, fast, safe dynamic JS loader, but don't need the overhead of dependency management or other extra functionality that larger script loaders provide.

Downloads
---------

  * [simpleload.js](https://github.com/zuulinc/simpleload/blob/master/simpleload.js)

Usage
-----

Using Simple Load is simple. Just call the appropriate methods to queue JavaScript as a URL or array of URLs. You can also provide a callback function if you'd like to be notified when the resources have finished loading and a context in which to execute the callback.

```js
// Queue a single JavaScript file and a callback when it finishes.
Load.get('http://example.com/foo.js', function() {
	alert('foo.js has been loaded');
});

// Queue multiple JS files and a callback when they've all finished.
Load.get(['foo.js', 'bar.js', 'baz.js'], function() {
	alert('all files have been loaded');
});

// Queue random JavaScript.
Load.get(function() {
	alert('random js execution');
});

// Add a script and a callback to the bottom of the queue.
Load.defer(['foo.js', 'bar.js', 'baz.js'], function() {
	alert('all files have been loaded');
});

// Executes all scripts and callbacks on the queue in the correct order.
Load.fetch();
```
