const Joi = require('@hapi/joi');
const i18next = require('i18next');
const Boom = require('@hapi/boom');
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
        return request.moduleName || 'common';
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

      class I18N {
        constructor() {
          this._lang = language;
          this._ns = getNamespace(request);
        }
        setNS(ns) {
          this._ns = ns;
          return this;
        }
        getNS() {
          return this._ns;
        }
        setLang(lang) {
          this._lang = lang;
        }
        getLang() {
          return this._lang;
        }
        i18next() {
          return i18next;
        }
        t(key) {
          const trans = i18next.getFixedT(this._lang, this._ns);
          return trans(key);
        }
        exec(callback = {}) {
          const { error } = Joi.function().validate(callback);
          if (error) {
            throw Boom.badImplementation('the params of Kit.#schema is error!');
          } else {
            callback({ server, request });
          }
          return this;
        }
      }
      const instances = {};
      function i18n(id = 'default') {
        const instance = instances[id];
        if (instance) {
          return instance;
        }
        return (instances[id] = new I18N());
      }

      setMixin({ server, request, i18n, I18N });
      return h.continue;
    });
  },
};
