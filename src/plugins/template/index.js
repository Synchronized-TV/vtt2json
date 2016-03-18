export function headerParser(input) {
  let templates = [];
  let matches;
  let re = /(<template>[\s\S]*<\/template>)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      templates.push(matches[1]);
    }
  }

  return templates.length ? {
    templates: templates
  } : undefined;
};

export function cueBodyParser(input) {
  let matches;
  let re = /<apply-template id="(.*)">([\s\S]*)<\/apply-template>/;

  return (matches = input.match(re)) ? {
    template: {
      id: matches[1],
      host: matches[2]
    }
  } : undefined;
}
