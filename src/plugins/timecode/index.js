import timecodeToSeconds from './timecodeToSeconds';

export function cueMetadataParser(input) {
  let matches;
  let re = /([0-9]+:[0-9]+:[0-9]+.[0-9]+) --> ([0-9]+:[0-9]+:[0-9]+.[0-9]+)/;

  return (matches = input.match(re)) ? {
    start: timecodeToSeconds(matches[1]),
    end: timecodeToSeconds(matches[2])
  } : undefined;
};
