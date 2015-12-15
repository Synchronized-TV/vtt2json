#!/usr/bin/env node
var fs = require('fs');
var minimist = require('minimist');
var through2 = require('through2');
var stringify = require('json-stable-stringify');

var vtt = require('./../');
var generateCue = require('../lib/generateCue');

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
else if (fs.existsSync(filename)) input = fs.createReadStream(filename);
else {
    console.error('File: %s does not exist', filename);
    process.exit(2);
}

if (argv._[2] === 'parse') {
    var stream = input.pipe(vtt.parse())
        .pipe(through2.obj(function(obj, enc, cb) {
            cb(null, generateCue(obj))
        }))
        .pipe(through2.obj(function(obj, enc, cb) {
            //console.log(JSON.stringify(obj, null, ' ').indexOf('testr') > -1);
            //cb(null, JSON.stringify(obj, null, ' '))
            cb(null, stringify(obj, function (a, b) {
                // Important: sort by time (keys)
                return parseFloat(a.key) - parseFloat(b.key);
            }, { space: '  ' }))
        }))
        .pipe(output);
}

if (argv._[2] === 'serialize') {
    input.pipe(vtt.serialize())
        .pipe(output);
}
