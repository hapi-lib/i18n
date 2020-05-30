# hapi-lib/i18n

## install

```
npm install @hapi-lib/i18n
```

## register

```js
server.register('@hapi-lib/i18n', {
  async getResources(server) {
    return {
      zh: {
        username: '用户名',
      },
      en: {
        username: 'user name',
      },
    };
  },

  // parse the language from the request
  parseLanguage: (request) => 'en',

  setMixin({ server, request, i18n }) {
    request.i18n = i18n;
  },

  getNamespace(request) {
    // you can set request.moduleName in business module plugin
    // server.ext('onRequest', (request, h) => {
    //   request.moduleName = 'account';
    //   return h.continue;
    // });

    return request.moduleName || 'common';
  },
});
```

## use in handler or other place with a request params

```js
function xxx(request) {
  const key = 'username'; // the key which is defined in resources
  const text = request.i18n().t(key);
}
```

## default options for the plugin

```js
const defaultOptions = {
  getResources = () => ({}),
  parseLanguage = (request) => 'en',
  setMixin = ({ options, Kit, Joi }) => {
    options.Kit = Kit;
    options.Joi = Joi;
  },
  getNamespace({request, i18n}) {
    request.i18n = i18n
  }
}
```
