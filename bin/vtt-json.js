#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var minimist = require('minimist');
var convert = require('../dist').default;
var defaultPlugins = require('../dist/plugins');

var argv = minimist(process.argv, {
  alias: {
    v: 'version',
    h: 'help'
  },
  boolean: ['version', 'help']
});

if (argv.version) {
  console.log(require('./../package').version);
  process.exit(0);
}

if (argv.help) {
  console.log("\nvtt-json.js input (output) (opts)\n\n" +
    "* input : a path to a VTT file.\n" +
    "* output (optional) : a path to the output JSON file. Will use input filename with .json extension if not provided.\n" +
    "* opts :\n" +
    "  --plugins : a comma separated list of plugins. a plugin can either be one of the default plugins, npm modules, or a relative path to a custom plugin. *default value*: `timecodes,regions,text,json,html\n");
  process.exit(0);
}

var headers = argv.headers && argv.headers.toString().split(argv.separator);
var inputFile = argv._[2];
var outputFile = argv._[3] || inputFile.replace(/\.vtt$/, '.json');
var pluginsFiles = argv.plugins ? argv.plugins.split(',') : ['timecodes', 'regions', 'text', 'json', 'html'];
var plugins = [];

if (!fs.existsSync(inputFile)) {
  console.error('File: %s does not exist', inputFile);
  process.exit(2);
}

for (var i in pluginsFiles) {
  var plugin;

  if (pluginsFiles[i].match(/^[\.\/]/)) {
    plugin = require(path.resolve('..', pluginsFiles[i]));
  }
  else {
    if (defaultPlugins[pluginsFiles[i]]) {
      plugin = defaultPlugins[pluginsFiles[i]];
    }
    else {
      plugin = require(pluginsFiles[i]);
    }
  }

  plugins.push(plugin);
}

if (inputFile && outputFile) {
  convert(inputFile, outputFile, plugins);
}
