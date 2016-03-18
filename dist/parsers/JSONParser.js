"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = JSONParser;
function JSONParser(input) {
  if (!input.match(/^[\{\[]/)) {
    return null;
  }

  return JSON.parse(input);
};