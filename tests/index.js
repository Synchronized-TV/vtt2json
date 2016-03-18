import assert from 'assert';
import fs from 'fs';
import path from 'path';

import convert, { plugins as defaultPlugins } from '../src';

const plugins = [];

for (var i in defaultPlugins) {
  plugins.push(defaultPlugins[i]);
}

describe('vttx', () => {
  it('should transform sample correctly ', (done) => {
    let inputFile = path.join(__dirname, 'samples', 'cue.vtt');
    let expected = require(path.join(__dirname, 'samples', 'cue.json'));

    convert(inputFile, '/dev/null', plugins, data => {
      assert.deepEqual(expected, data);
      done();
    });
  });
});
