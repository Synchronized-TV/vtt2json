import split from 'split';
import through from 'through';

const headerSplit = /(WEBVTT([\.\s\S]*?)\n\n)/;
const regionRe = /Region: id=(.*)/;

export default function headerTransformer(stream) {
  //result.regions = [];

  return stream
    .pipe(split())
    .pipe(through(function(chunk) {
      const matches = chunk.match(regionRe);

      if (matches) {
        this.queue(matches[1]);
      }
    }))
    // .on('data', data => {
    //   result.regions.push(data);
    // });
}
