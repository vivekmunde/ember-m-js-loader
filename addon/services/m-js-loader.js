import Ember from 'ember';

// @public
export default Ember.Service.extend({

    // @private
    _cache: Ember.A(),

    // @private
    _isCached(src) {
        return this.get('_cache').includes(src);
    },

    // @private
    _updateCache(src) {
        this.get('_cache').pushObject(src);
    },

    // @private
    _getScriptAttr(attr) {
        return Object.assign(
            {
                type: 'text/javascript'
            },
            attr
        );
    },

    // @private
    _loadJs(attr) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            Ember.$("<script>")
                .appendTo("body")
                .on('load', () => {
                    resolve();
                })
                .on('error', () => {
                    reject();
                })
                .attr(this._getScriptAttr(attr));
        });
    },

    // @private
    _isValidAttr(attr) {
        return !Ember.isEmpty(attr) && !Ember.isEmpty(attr.src) && !Ember.isBlank(attr.src);
    },

    // @public
    load(attr) {
        return new Ember.RSVP.Promise((resolve, reject) => {
            if (!this._isValidAttr(attr)) {
                resolve();
                return;
            }
            if (this._isCached(attr.src)) {
                resolve();
                return;
            }
            this._loadJs(attr).then(() => {
                this._updateCache(attr.src);
                resolve();
            }, () => {
                reject();
            });
        });
    }

});