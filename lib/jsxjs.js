var babel = require('babel-core');
var jsxjsPlugin = require('./babel-plugin-jsxjs');

module.exports = function JSXJS(code) {
  return babel.transform(code, {
    'plugins': ['syntax-jsx', jsxjsPlugin.default]
  }).code;
};
