'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cueBodyParser = cueBodyParser;

var _babelPluginSyntaxJsx = require('babel-plugin-syntax-jsx');

var _babelPluginSyntaxJsx2 = _interopRequireDefault(_babelPluginSyntaxJsx);

var _babelPluginObjectJsx = require('./babel-plugin-object-jsx');

var _babelPluginObjectJsx2 = _interopRequireDefault(_babelPluginObjectJsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babel = require('babel-core');
function cueBodyParser(input) {
  if (!input.match(/^<.*>/)) {
    return undefined;
  }

  var code = null;
  var output = undefined;

  try {
    code = babel.transform('<div>' + input + '</div>', {
      'plugins': [_babelPluginSyntaxJsx2.default, _babelPluginObjectJsx2.default]
    }).code;

    output = eval(code).props.children;
    output = output.length > 1 ? output : output[0];
  } catch (e) {
    console.error('Could not process input', input);
  }

  return output !== undefined ? {
    jsx: output
  } : undefined;
};