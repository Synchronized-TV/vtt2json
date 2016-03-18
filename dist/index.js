'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugins = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = convert;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _headerParser = require('./headerParser');

var _headerParser2 = _interopRequireDefault(_headerParser);

var _bodyParser = require('./bodyParser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _plugins2 = require('./plugins');

var _plugins = _interopRequireWildcard(_plugins2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.plugins = _plugins;
function convert(inputFile, outputFile, plugins, cb) {
  var stream = _fs2.default.createReadStream(inputFile);

  var output = { cues: [] };
  var done = 0;

  function onEnd() {
    if (++done >= 2) {
      _fs2.default.writeFile(outputFile, JSON.stringify(output, null, '  '), function () {
        if (cb) {
          cb(output);
        }
        console.log('\n✓ ' + inputFile + ' → ' + outputFile);
      });
    }
  }

  (0, _headerParser2.default)(stream, plugins).on('data', function (data) {
    return output = _extends({}, output, data);
  }).on('end', onEnd);

  (0, _bodyParser2.default)(stream, plugins).on('data', function (data) {
    return output.cues.push(data);
  }).on('end', onEnd);
}