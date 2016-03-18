export function cueBodyParser(input) {
  return input.match(/^[\{\[]/) ? {
    json: JSON.parse(input)
  } : undefined;
};
