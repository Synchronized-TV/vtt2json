import fs from 'fs';
import split from 'split';

export default function handleStream(stream, streamHandlers) {
  let result = {};

  for (let i = 0; i < streamHandlers.length; i++) {
    streamHandlers[i](stream, result)
      .on('end', () => {
        if (i === streamHandlers.length - 1) {
          console.log(result);
        }
      });
  }
}
/*
function parseHeaderRegions(file) {
  const input = fs.readFileSync(file).toString();
  const header = input.match(headerRe)[2];
  return header.match(regionRe).map(line => line.replace('Region: id=', ''));
}

function parseContent(file, parsers) {
  fs.createReadStream(file)
    .pipe(split(splitRe))
    .pipe(through(function(chunk) {
      if (chunk) {
        const [cueHeader, ...cueBodyLines] = chunk.split('\n');
        const cueBody = cueBodyLines.join('\n');
        const [match, startTimestamp, endTimestamp, region] = cueHeader.match(cueHeaderRe) || [];

        if (startTimestamp && endTimestamp) {
          const start = timestampToSeconds(startTimestamp);
          const end = timestampToSeconds(endTimestamp);
          const payload = parsers.map(parse => parse(cueBody, start, end)).join('');

          this.queue(payload);
        }
      }
    }))
    .on('data', function(chunk){
      console.log(chunk);
    })
}
*/