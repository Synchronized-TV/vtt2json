#!/usr/bin/env node
var fs = require('fs');
var minimist = require('minimist');
var convert = require('../lib').default;

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

var input;
if (filename === '-' || !filename) input = process.stdin;
else if (fs.existsSync(filename)) input = fs.createReadStream(filename);
else {
    console.error('File: %s does not exist', filename);
    process.exit(2);
}

if (argv._[2] === 'parse') {
    convert(input, argv.output);
}
