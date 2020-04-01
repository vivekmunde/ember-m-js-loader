import { A } from '@ember/array';
import { Promise } from 'rsvp';
import Service from '@ember/service';
import { isEmpty, isBlank } from '@ember/utils';

// @public
export default Service.extend({

    // @private
    _cache: A(),

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
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");

            document.body.appendChild(script);

            script.addEventListener('load', () => {
                resolve();
            });

            script.addEventListener('error', () => {
                reject();
            });

            const scriptAttrs = this._getScriptAttr(attr);
            Object.keys(scriptAttrs)
                .forEach(key => {
                    script.setAttribute(key, scriptAttrs[key]);
                });
        });
    },

    // @private
    _isValidAttr(attr) {
        return !isEmpty(attr) && !isEmpty(attr.src) && !isBlank(attr.src);
    },

    // @public
    load(attr) {
        return new Promise((resolve, reject) => {
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