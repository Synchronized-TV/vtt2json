'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JSXParser;

var _babelPluginJsx = require('./babel-plugin-jsx');

var _babelPluginJsx2 = _interopRequireDefault(_babelPluginJsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babel = require('babel-core');
function JSXParser(input) {
  if (!input.match(/^<.*>/)) {
    return null;
  }

  var code = null;
  var output = null;

  try {
    code = babel.transform('<div>' + input + '</div>', {
      'plugins': ['syntax-jsx', _babelPluginJsx2.default]
    }).code;

    // TODO: Safe eval.
    output = eval(code).props.children;
    //output = output.length > 1 ? output : output[0];
  } catch (e) {
    console.error('Could not process input', input);
  }

  return output;
};