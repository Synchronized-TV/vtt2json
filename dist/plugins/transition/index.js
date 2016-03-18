'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cueMetadataParser = cueMetadataParser;
function cueMetadataParser(input) {
  var matches = void 0;
  var re = /transition:([\w-_]+)\s([0-9]+[a-z]+)/;

  return (matches = input.match(re)) ? {
    transition: matches[1],
    'transition-duration': matches[2]
  } : undefined;
}