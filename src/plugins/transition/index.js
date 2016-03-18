export function cueMetadataParser(input) {
  let matches;
  let re = /transition:([\w-_]+)\s([0-9]+[a-z]+)/;

  return (matches = input.match(re)) ? {
    transition: matches[1],
    'transition-duration': matches[2]
  } : undefined;
}
