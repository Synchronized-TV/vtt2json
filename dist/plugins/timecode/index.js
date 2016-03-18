'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cueMetadataParser = cueMetadataParser;

var _timecodeToSeconds = require('./timecodeToSeconds');

var _timecodeToSeconds2 = _interopRequireDefault(_timecodeToSeconds);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cueMetadataParser(input) {
  var matches = void 0;
  var re = /([0-9]+:[0-9]+:[0-9]+.[0-9]+) --> ([0-9]+:[0-9]+:[0-9]+.[0-9]+)/;

  return (matches = input.match(re)) ? {
    start: (0, _timecodeToSeconds2.default)(matches[1]),
    end: (0, _timecodeToSeconds2.default)(matches[2])
  } : undefined;
};