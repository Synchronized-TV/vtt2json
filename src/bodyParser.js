import split from 'split';
import through from 'through';
import { applyPlugins, applyPluginsOnce } from './applyPlugins';

const bodySplit = /([0-9]+:[0-9]+:[0-9]+.[0-9]+ --> [0-9]+:[0-9]+:[0-9]+.[0-9]+[\.\s\S]*?)\n\n/g;

export default function cueBodyParser(stream, plugins) {
  return stream
    .pipe(split(bodySplit))
    .pipe(through(function(chunk) {
      if (chunk && !chunk.match(/^WEBVTT\n/)) {
        const [cueMetadata, ...cueBodyLines] = chunk.split('\n');
        const cueBody = cueBodyLines.join('\n');

        this.queue({
          ...applyPlugins(plugins, 'cueMetadataParser', cueMetadata),
          ...applyPluginsOnce(plugins, 'cueBodyParser', cueBody)
        });
      }
    }));
}
