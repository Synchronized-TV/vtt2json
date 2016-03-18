"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerParser = headerParser;
exports.cueBodyParser = cueBodyParser;
function headerParser(input) {
  var styles = [];
  var matches = void 0;
  var re = /(<style>[\s\S]*<\/style>)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      styles.push(matches[1]);
    }
  }

  return styles.length ? {
    styles: styles
  } : undefined;
};

function cueBodyParser(input) {
  return input.match(/^<style>/) ? {
    style: input
  } : undefined;
};