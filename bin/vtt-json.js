#!/usr/bin/env node
var fs = require('fs');
var minimist = require('minimist');
var through2 = require('through2');
var stringify = require('json-stable-stringify');
var async = require('async');
var path = require('path');
var Stream = require('stream');

var vtt = require('./../');
var generateCue = require('../lib/generateCue');

function getConcatenatedReadStream(directory, onStream) {
    if (fs.lstatSync(directory).isFile()) {
        onStream(fs.createReadStream(directory));
    }
    else {
        fs.readdir(directory, function (err, files) {
          var concatenated = '';
          async.eachSeries(files, function (file, callback) {
            if (file.indexOf('.vtt') === -1) { return callback(); }

            var currentFile = path.join(directory, file);
            fs.stat(currentFile, function (err, stats) {
              if (stats.isDirectory()) { return callback(); }

              var stream = fs.createReadStream(currentFile).on('end', function () {
                callback();
              }).on('data', function (data) { concatenated += data.toString('utf8'); });
            });
          }, function() {
            var s = new Stream.Readable();
            s._read = function noop() {};
            s.push(concatenated);
            s.push(null);

            onStream(s);
          })
        });
    }
}

var argv = minimist(process.argv, {
    alias: {
        v: 'version',
        o: 'output'
    },
    boolean: ['version', 'help']
});

var headers = argv.headers && argv.headers.toString().split(argv.separator);
var filename = argv._[3];

if (argv.version) {
    console.log(require('./../package').version);
    process.exit(0);
}
var output = (argv.output && argv.output !== '-') ? fs.createWriteStream(argv.output) : process.stdout;

var input;
if (filename === '-' || !filename) input = process.stdin;

if (argv._[2] === 'parse') {
    var stream = getConcatenatedReadStream(filename, input => {
        input.pipe(vtt.parse())
        .pipe(through2.obj(function(obj, enc, cb) {
            cb(null, generateCue(obj))
        }))
        .pipe(through2.obj(function(obj, enc, cb) {
            //cb(null, JSON.stringify(obj, null, ' '))
            cb(null, stringify(obj, function (a, b) {
                // Important: sort by time (keys)
                return parseFloat(a.key) - parseFloat(b.key);
            }, { space: '  ' }))
        }))
        .pipe(output)
    });
}

if (argv._[2] === 'serialize') {
    input.pipe(vtt.serialize())
        .pipe(output);
}
