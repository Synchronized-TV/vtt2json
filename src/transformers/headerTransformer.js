import split from 'split';
import through from 'through';

const headerSplit = /(WEBVTT([\.\s\S]*?)\n\n)/;
const regionRe = /Region: id=(.*)/;

export default function headerTransformer(stream) {
  return stream
    .pipe(split())
    .pipe(through(function(chunk) {
      const matches = chunk.match(regionRe);

      if (matches) {
        this.queue(matches[1]);
      }
    }));
}
