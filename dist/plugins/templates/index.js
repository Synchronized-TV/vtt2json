"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerParser = headerParser;
exports.cueBodyParser = cueBodyParser;
function headerParser(input) {
  var templates = [];
  var matches = void 0;
  var re = /(<template>[\s\S]*<\/template>)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      templates.push(matches[1]);
    }
  }

  return templates.length ? {
    templates: templates
  } : undefined;
};

function cueBodyParser(input) {
  var matches = void 0;
  var re = /<apply-template id="(.*)">([\s\S]*)<\/apply-template>/;

  return (matches = input.match(re)) ? {
    template: {
      id: matches[1],
      host: matches[2]
    }
  } : undefined;
}