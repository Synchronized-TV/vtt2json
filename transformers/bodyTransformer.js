import split from 'split';
import through from 'through';
import { timestampToSeconds } from './timeUtils';

const bodySplit = /([0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+ region:[\w]+[\.\s\S]*?)\n\n/g;
const cueHeaderRe = /([0-9]+:[0-9]+:[0-9]+.[0-9]+) --> ([0-9]+:[0-9]+:[0-9]+.[0-9]+)\s+region:([\w]+)/;

export default function bodyTransformer(...parsers) {
  return function(stream) {
    //result.cues = [];

    return stream
      .pipe(split(bodySplit))
      .pipe(through(function(chunk) {
        if (chunk) {
          const [cueHeader, ...cueBodyLines] = chunk.split('\n');
          const cueBody = cueBodyLines.join('\n');
          const [match, startTimestamp, endTimestamp, region] = cueHeader.match(cueHeaderRe) || [];

          if (cueBody && startTimestamp && endTimestamp) {
            const start = timestampToSeconds(startTimestamp);
            const end = timestampToSeconds(endTimestamp);
            let payload;

            for (const parse of parsers) {
              payload = parse(cueBody, start, end);

              if (payload !== null) {
                break;
              }
            }

            this.queue(JSON.stringify(payload));
          }
        }
      }))
      // .on('data', data => {
      //   if (data) {
      //     result.cues.push(data);
      //   }
      // });
  }
}
