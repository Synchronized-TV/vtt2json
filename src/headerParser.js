import split from 'split';
import through from 'through';
import { applyPlugins } from './applyPlugins';

const headerSplit = /[0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+/g;

export default function headerParser(stream, plugins) {
  return stream
    .pipe(split(headerSplit))
    .pipe(through(function(chunk) {
      if (chunk && chunk.match(/^WEBVTT\n/)) {
        this.queue(applyPlugins(plugins, 'headerParser', chunk));
      }
    }));
}
