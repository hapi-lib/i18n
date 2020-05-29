const Joi = require('@hapi/joi');
const i18next = require('i18next');
exports.plugin = {
  pkg: require('../package.json'),
  register: async function (server, options = {}) {
    const {
      getResources = () => ({}),
      parseLanguage = (request) => request.query.lang || 'cn',
      setMixin = ({ request, i18n }) => {
        request.i18n = i18n;
      },
      getNamespace = (request) => {
        return request.namespace || 'translation';
      },
    } = options;

    Joi.assert(getResources, Joi.function().label('getResources arguments'));
    Joi.assert(parseLanguage, Joi.function().label('parseLanguage arguments'));
    Joi.assert(setMixin, Joi.function().label('setMixin arguments'));
    Joi.assert(getNamespace, Joi.function().label('getNamespace arguments'));

    const resources = await getResources(server);
    await i18next.init({
      lng: 'en',
      resources,
      defaultNS: 'common',
    });

    server.ext('onRequest', (request, h) => {
      const language = parseLanguage(request);

      class Instance {
        constructor() {
          this._lang = language;
          this._ns = getNamespace(request) || 'translation';
        }
        ns(ns) {
          this._ns = ns;
          return this;
        }
        lang(lang) {
          this._lang = lang;
          return this;
        }
        t(key) {
          console.log(this._lang);
          const trans = i18next.getFixedT(this._lang, this._ns);
          return trans(key);
        }
      }
      // const i18n = new Instance();
      function i18n() {
        return new Instance();
      }

      setMixin({ request, i18n });
      return h.continue;
    });
  },
};
