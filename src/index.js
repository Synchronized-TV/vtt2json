import fs from 'fs';
import headerTransformer from './transformers/headerTransformer';
import bodyTransformer from './transformers/bodyTransformer';
import JSXParser from './parsers/JSXParser';
import JSONParser from './parsers/JSONParser';
import stringify from 'json-stable-stringify';
import compatGenerateCue from './compatGenerateCue';
//import mergeStream from 'merge-stream';

// const inputFile = process.argv[2];
// const outputFile = process.argv[3] || inputFile.replace('.vtt', '.json');

//const stream = fs.createReadStream(inputFile);

//const mergedStream = mergeStream(headerTransformer(stream), bodyTransformer(JSXParser, JSONParser)(stream));
//mergedStream.pipe(fs.createWriteStream(outputFile));

// TODO: This below is to stay compatible with current cue.json format.
// Ideally, we would directly write the file from the stream.
// Figure out what the format should look like, having "regions" and "cue"
// is not practical to process streams directly, and regions might not be needed.
function handleStream(stream, outputFile, streamHandlers) {
  let result = {
    regions: [],
    cue: []
  };

  let i = 0;

  for (let id in streamHandlers) {
    result[id] = [];

    streamHandlers[id](stream, result)
      .on('data', data => {
        if (data) {
          result[id].push(data);
        }
      })
      .on('end', () => {
        if (i === Object.keys(streamHandlers).length - 1) {
          result.cue = compatGenerateCue(result.cue);
          fs.writeFileSync(outputFile, stringify(result));
        }

        i++;
      });    
  }
}

export default function convert(stream, outputFile) {
  handleStream(stream, outputFile, {
    regions: headerTransformer,
    cue: bodyTransformer(JSXParser, JSONParser)
  });
}
