import assert from 'assert';
import fs from 'fs';
import path from 'path';

import convert from '../src';

describe('vtt-json', () => {

    it('should transform sample correctly ', (done) => {

        let inputStream = fs.createReadStream(path.join(__dirname, 'samples', 'cue.vtt'));
        let expected = require(path.join(__dirname, 'samples', 'cue.json'));

        convert(inputStream, '/dev/null', data => {
            assert.deepEqual(expected, data);
            done();
        });

    });
})
