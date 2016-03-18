'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = headerParser;

var _split = require('split');

var _split2 = _interopRequireDefault(_split);

var _through = require('through');

var _through2 = _interopRequireDefault(_through);

var _applyPlugins = require('./applyPlugins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var headerSplit = /[0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+/g;

function headerParser(stream, plugins) {
  return stream.pipe((0, _split2.default)(headerSplit)).pipe((0, _through2.default)(function (chunk) {
    if (chunk && chunk.match(/^WEBVTT\n/)) {
      this.queue((0, _applyPlugins.applyPlugins)(plugins, 'headerParser', chunk));
    }
  }));
}