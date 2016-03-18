export function headerParser(input) {
  let regions = [];
  let matches;
  let re = /Region: id=(.*)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      regions.push(matches[1]);
    }
  }

  return regions.length ? {
    regions: regions
  } : undefined;
};

export function cueMetadataParser(input) {
  let matches;
  let re = /region:([\w]+)/;

  return (matches = input.match(re)) ? {
    region: matches[1]
  } : undefined;
}
