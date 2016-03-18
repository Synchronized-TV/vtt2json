export function cueBodyParser(input) {
  return input.match(/^[a-z]/i) ? {
    text: input
  } : undefined;
};
