'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = cueBodyParser;

var _split = require('split');

var _split2 = _interopRequireDefault(_split);

var _through = require('through');

var _through2 = _interopRequireDefault(_through);

var _applyPlugins = require('./applyPlugins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var bodySplit = /([0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+[\.\s\S]*?)\n\n/g;

function cueBodyParser(stream, plugins) {
  return stream.pipe((0, _split2.default)(bodySplit)).pipe((0, _through2.default)(function (chunk) {
    if (chunk && !chunk.match(/^WEBVTT\n/)) {
      var _chunk$split = chunk.split('\n');

      var _chunk$split2 = _toArray(_chunk$split);

      var cueMetadata = _chunk$split2[0];

      var cueBodyLines = _chunk$split2.slice(1);

      var cueBody = cueBodyLines.join('\n');

      this.queue(_extends({}, (0, _applyPlugins.applyPlugins)(plugins, 'cueMetadataParser', cueMetadata), (0, _applyPlugins.applyPluginsOnce)(plugins, 'cueBodyParser', cueBody)));
    }
  }));
}