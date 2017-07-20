import Ember from 'ember';

export default Ember.Route.extend({
    mJsLoader: Ember.inject.service('m-js-loader'),
    beforeModel() {
        return this.get('mJsLoader').load({
            href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
            integrity: 'sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa',
            crossorigin: 'anonymous'
        });
    }
});
