export function cueBodyParser(input) {
  return input.match(/^<([a-z\-]+)/) ? {
    html: input
  } : undefined;
};
