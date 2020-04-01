ember-m-js-loader
==============================================================================

This [Ember.js](https://emberjs.com/) addon helps load the js file(s) on demand, i.e. lazy loading, inside the `<script>` tag in the `document` `<body>` using the service `m-js-loader` .

### Compatibility
Ember@^3.0.0

### Deferred Loading of JS

The ambitious SPAs need more than one JS resources (external libraries) and some of these JS resources can be more functionality centric and may not be required to get loaded on the initial screen or may be required only for few of screens. The loading of scripts that are not necessary for the initial page load can be deferred until after the initial load. Doing so can help reduce resource contention and improve performance.

Suppose a web app uses Maps Library (like [leaflet](https://leafletjs.com)) for displaying maps, which comes with its own JS. The maps are displayed only on couple of routes other than home screen. So the home screen is not needed to load the JS for maps. The maps JS should be loaded when the routes displaying maps are requested. In this scenario, its always preferable to load the JS dynamically.

## `.load(attr)`

The method to load a JS file on demand.

`attr` is a JSON object which holds the attribute values for the `<script>` tag to load JS. It should at least have `src` property set to the source of the JS. 

	mJsLoader: Ember.inject.service('m-js-loader'), 
	beforeModel() {
        this.get('mJsLoader').load({
                src: 'http://cdn-assets/maps.js',
                integrity: 'sha384-shfssiufhnof7348f738f7bw8g+Pmsjshdinwe98',
                crossorigin: 'anonymous'
            });
    }

#### Promise Based Load

The service `m-js-loader` returns a promise. The service listens to the events `onload` and `onerror` on the `<script>` tag in which the JS is loaded. It resolves the promise inside `onload` event and rejects it if `onerror` event is raised. 

Use of this promise is completely optional and upto the requirement of the app. If a route needs to wait until the JS gets loaded then the service can be used inside the `beforeModel` hook.
	
	mJsLoader: Ember.inject.service('m-js-loader'), 
	beforeModel() {
		return this.get('mJsLoader').load({
			src: '/assets/maps.js'
		});
	}

#### Caching

The service `m-js-loader` caches the `src`s loaded to avoid injecting the same JS more than once.

#### CORS

The service inserts a `<script>` tag which as good as having it hardcoded at the time of html load. So no [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) issue.

Installation
------------------------------------------------------------------------------

```
ember install ember-m-js-loader
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-m-js-loader`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
