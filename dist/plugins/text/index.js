"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cueBodyParser = cueBodyParser;
function cueBodyParser(input) {
  return input.match(/^[a-z]/i) ? {
    text: input
  } : undefined;
};