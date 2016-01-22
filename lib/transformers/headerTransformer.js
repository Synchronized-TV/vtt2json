'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = headerTransformer;

var _split = require('split');

var _split2 = _interopRequireDefault(_split);

var _through = require('through');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headerSplit = /(WEBVTT([\.\s\S]*?)\n\n)/;
var regionRe = /Region: id=(.*)/;

function headerTransformer(stream) {
  return stream.pipe((0, _split2.default)()).pipe((0, _through2.default)(function (chunk) {
    var matches = chunk.match(regionRe);

    if (matches) {
      this.queue(matches[1]);
    }
  }));
}