"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerParser = headerParser;
exports.cueMetadataParser = cueMetadataParser;
function headerParser(input) {
  var regions = [];
  var matches = void 0;
  var re = /Region: id=(.*)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      regions.push(matches[1]);
    }
  }

  return regions.length ? {
    regions: regions
  } : undefined;
};

function cueMetadataParser(input) {
  var matches = void 0;
  var re = /region:([\w]+)/;

  return (matches = input.match(re)) ? {
    region: matches[1]
  } : undefined;
}