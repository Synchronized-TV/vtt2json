import fs from 'fs';
import handleStream from './handleStream';
import headerTransformer from './transformers/headerTransformer';
import bodyTransformer from './transformers/bodyTransformer';
import JSXParser from './parsers/JSXParser';
import JSONParser from './parsers/JSONParser';
import mergeStream from 'merge-stream';
 
const inputFile = process.argv[2];
const outputFile = process.argv[3] || inputFile.replace('.vtt', '.json');

//const output = handleStream(fs.createReadStream(inputFile), [headerTransformer, bodyTransformer(JSXParser, JSONParser)]);
//const seriesStream = createSeriesStream();
const stream = fs.createReadStream(inputFile);

let result = {
  regions: [],
  cue: []
};

const mergedStream = mergeStream(headerTransformer(stream), bodyTransformer(JSXParser, JSONParser)(stream));

mergedStream.pipe(fs.createWriteStream(outputFile));

//seriesStream.pipe(fs.createWriteStream(outputFile));

// headerHandler(stream).on('data', data => {
//   result.regions.push(data);
// });

// bodyHandler(JSXParser, JSONParser)(stream).on('data', data => {
//   result.cue.push(data);
// });

//createWriteStream(path);

/*

console.log(output);

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
    */