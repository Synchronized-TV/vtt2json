'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bodyTransformer;

var _split = require('split');

var _split2 = _interopRequireDefault(_split);

var _through = require('through');

var _through2 = _interopRequireDefault(_through);

var _timeUtils = require('./timeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var bodySplit = /([0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+ region:[\w]+[\.\s\S]*?)\n\n/g;
var cueHeaderRe = /([0-9]+:[0-9]+:[0-9]+.[0-9]+) --> ([0-9]+:[0-9]+:[0-9]+.[0-9]+)\s+region:([\w]+)/;

function bodyTransformer() {
  for (var _len = arguments.length, parsers = Array(_len), _key = 0; _key < _len; _key++) {
    parsers[_key] = arguments[_key];
  }

  return function (stream) {
    return stream.pipe((0, _split2.default)(bodySplit)).pipe((0, _through2.default)(function (chunk) {
      if (chunk) {
        var _chunk$split = chunk.split('\n');

        var _chunk$split2 = _toArray(_chunk$split);

        var cueHeader = _chunk$split2[0];

        var cueBodyLines = _chunk$split2.slice(1);

        var cueBody = cueBodyLines.join('\n');

        var _ref = cueHeader.match(cueHeaderRe) || [];

        var _ref2 = _slicedToArray(_ref, 4);

        var match = _ref2[0];
        var startTimestamp = _ref2[1];
        var endTimestamp = _ref2[2];
        var region = _ref2[3];

        if (cueBody && startTimestamp && endTimestamp) {
          var start = (0, _timeUtils.timestampToSeconds)(startTimestamp);
          var end = (0, _timeUtils.timestampToSeconds)(endTimestamp);
          var payload = undefined;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = parsers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var parse = _step.value;

              payload = parse(cueBody, start, end);

              if (payload !== null) {
                break;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var entry = { start: start, end: end, region: region, payload: payload, chunk: chunk };

          this.queue(entry);
        }
      }
    }));
  };
}