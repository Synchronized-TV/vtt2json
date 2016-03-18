import fs from 'fs';
import headerParser from './headerParser';
import bodyParser from './bodyParser';

export * as plugins from './plugins';

export default function convert(inputFile, outputFile, plugins, cb) {
  const stream = fs.createReadStream(inputFile);

  let output = { cues: [] };
  let done = 0;

  function onEnd() {
    if (++done >= 2) {
      fs.writeFile(outputFile, JSON.stringify(output, null, '  '), () => {
        if (cb) {
          cb(output);
        }
        console.log(`\n✓ ${inputFile} → ${outputFile}`);
      });
    }
  }

  headerParser(stream, plugins)
    .on('data', data => output = { ...output, ...data })
    .on('end', onEnd);

  bodyParser(stream, plugins)
    .on('data', data => output.cues.push(data))
    .on('end', onEnd);
}
