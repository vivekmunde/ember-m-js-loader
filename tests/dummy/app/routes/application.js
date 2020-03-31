import Route from '@ember/routing/route';
import { inject } from '@ember/service';

export default Route.extend({
    mJsLoader: inject('m-js-loader'),
    beforeModel() {
        return this.get('mJsLoader').load({
            href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
            integrity: 'sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa',
            crossorigin: 'anonymous'
        });
    }
});
