'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convert;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _headerTransformer = require('./transformers/headerTransformer');

var _headerTransformer2 = _interopRequireDefault(_headerTransformer);

var _bodyTransformer = require('./transformers/bodyTransformer');

var _bodyTransformer2 = _interopRequireDefault(_bodyTransformer);

var _JSXParser = require('./parsers/JSXParser');

var _JSXParser2 = _interopRequireDefault(_JSXParser);

var _JSONParser = require('./parsers/JSONParser');

var _JSONParser2 = _interopRequireDefault(_JSONParser);

var _jsonStableStringify = require('json-stable-stringify');

var _jsonStableStringify2 = _interopRequireDefault(_jsonStableStringify);

var _compatGenerateCue = require('./compatGenerateCue');

var _compatGenerateCue2 = _interopRequireDefault(_compatGenerateCue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var result = {
    regions: [],
    cue: []
  };

  var i = 0;

  var _loop = function _loop(id) {
    result[id] = [];

    streamHandlers[id](stream, result).on('data', function (data) {
      if (data) {
        result[id].push(data);
      }
    }).on('end', function () {
      if (i === Object.keys(streamHandlers).length - 1) {
        result.cue = (0, _compatGenerateCue2.default)(result.cue);
        _fs2.default.writeFileSync(outputFile, (0, _jsonStableStringify2.default)(result));
      }

      i++;
    });
  };

  for (var id in streamHandlers) {
    _loop(id);
  }
}

function convert(stream, outputFile) {
  handleStream(stream, outputFile, {
    regions: _headerTransformer2.default,
    cue: (0, _bodyTransformer2.default)(_JSXParser2.default, _JSONParser2.default)
  });
}