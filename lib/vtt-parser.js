var stream = require('stream');
var fs = require('fs');
var inherits = require('inherits');
var split = require('split');
var objectAssign = require('object-assign');
var parser = require('xml2json');
var htmlparser = require('./htmlparser');

module.exports = function() {
    return new Parser();
};

var Parser = function() {
    stream.Transform.call(this, {objectMode:true, highWaterMark:16})

    this._i = 0;
    this._bufferTail = null;
    this._currentItem = null;
    this._cueLoopStarted = false;
    this._retObj = { items: [], regions: [] };
};

inherits(Parser, stream.Transform);

Parser.prototype._transform = function(chunk, enc, cb) {
    if (chunk instanceof Buffer) {
        chunk = chunk.toString();
    }

    if (this._bufferTail === null) {
        chunk = this._bufferTail + chunk;
    }

    var NEWLINE = /\r\n|\r|\n/;
    var lines = chunk.split(NEWLINE);

    this._bufferTail = lines.pop();

    while (lines.length > 0) {
        line = lines.shift();
        this._handleLine(line);
    }
    cb();
};

// Currently, all output is handled in _flush because there is only a single
// JSON object that can be written and it isn't handled as a stream. This may
// change in the future if requested.
Parser.prototype._flush = function(cb) {
    if (this._bufferTail !== null) {
        this._handleLine(this._bufferTail);
    }
    this._pushCurrentItem();

    this.push(this._retObj);
    cb();
};

Parser.prototype._handleLine = function(line) {
    if (line.indexOf('Region: id') === 0) {
        this._currentItem = { type: 'region', id: line.split('=')[1] };
        this._pushCurrentItem();
    }
    else if (line.length === 0) {
        this._pushCurrentItem();
    }
    else if (line.indexOf("NOTE") === 0) {
        this._initCurrentItem();
        this._currentItem.type = "comment";
        line.replace("NOTE", "");
        this._currentItem.payload.push(line);
    }
    else if (line.indexOf( "-->" ) !== -1) {
        if (this._currentItem === null) {
            this._initCurrentItem();
            // This might already be set to true, but set it just in case.
            this._cueLoopStarted = true;
        }
        if (line.indexOf( " region:" ) !== -1) {
            this._currentItem.region = line.substr(line.indexOf( " region:" )+8).trim();
        }
        this._currentItem.type = "cue";
        this._currentItem.id = this.previousLine.trim() || '_' + this._i;
        objectAssign(this._currentItem, parseCueHeader(line));
    }
    else if (this._currentItem === null && this._cueLoopStarted) {
        this._initCurrentItem();
        this._currentItem.type = "cue";
        this._currentItem.id = line;
    }
    else if (this._cueLoopStarted) {
        this._currentItem.payload.push(line);
    }

    this._i++;
    this.previousLine = line;
};

Parser.prototype._initCurrentItem = function() {
    // Parsing for commented out attributes has not been implemented yet.
    this._currentItem =  {
        id: "",
        startTime: 0,
        endTime: 0,
//        pauseOnExit: false,
//        direction: "horizontal",
//        snapToLines: true,
//        linePosition: "auto",
//        textPosition: 50,
//        size: 100,
//        alignment: "middle",
        // Use payload instead of text here because it will be handled as an
        // array. A text property can later be added, concat-ing the payload.
        payload: []
//        tree: null
    }
}

Parser.prototype._pushCurrentItem = function() {
    if (this._currentItem !== null) {
        if (this._currentItem.type === 'region') {
            this._retObj.regions.push(this._currentItem.id);
        }
        else if (Array.isArray(this._currentItem.payload)) {
          if (this._currentItem.payload.join('').substr(0, 1) === '<' || this._currentItem.payload.join('').indexOf('>') > -1) {
            var payload = [];
            var items = [];

            for (var i in this._currentItem.payload) {
              var item = this._currentItem.payload[i];

              if (item.substr(0, 1) === '<' && item.substr(1, 1) !== '/') {
                items.push(item);
              }
              else {
                items[items.length - 1] += item;
              }
            }

            for (var i in items) {
              var results = '';
              var root = true;
              var content = items[i].replace(/\{/g, '"{').replace(/\}/g, '}"');

              // What do you mean when you say "this is pure crap" ?
              htmlparser(content, {
                start: function( tag, attrs, unary ) {
                  results += '{"type":"' + tag + '"';
                  results += ',"props":{';
                  results += attrs.map(function(attr) {
                    return '"'  + attr.name + '":"' + attr.escaped + '"';
                  }).join(',');

                  if (!unary) {
                    if (attrs && attrs.length) {
                      results += ',';
                    }
                    results += '"children":[';
                  }
                  else {
                    results += '}}';
                  }
                },
                end: function( tag ) {
                  results += ']}}';
                },
                chars: function( text ) {
                  //results += text;
                }
              });

              results = results.replace(/\}\{/g, '},{').replace(/"\{/g, '').replace(/\}"/g, '');
              try {
                payload.push(JSON.parse(results));
              }
              catch(e) {
                console.log(this._currentItem, e);
              }
              //payload[payload.length - 1].debug = JSON.stringify(this._currentItem, null, '  ');
            }

            this._currentItem.payload = payload;
          }
          else if (Array.isArray(this._currentItem.payload)) {
            //console.log(Array.isArray(this._currentItem.payload));
            this._currentItem.payload = JSON.parse(this._currentItem.payload.join(''));
          }
          else {
            //console.log(this._currentItem.payload);
          }
        }
        if (this._currentItem.payload && this._currentItem.endTime > this._currentItem.startTime) {
            this._retObj.items.push(this._currentItem);
        }
        this._currentItem = null
    }
};

function parseCueHeader(line) {
    var cue = {},
        rToken = /-->/,
        rWhitespace = /[\t ]+/;
    var lineSegments = line.replace( rToken, " --> " ).split( rWhitespace );

    if ( lineSegments.length < 2 ) {
        throw "Bad cue";
    }

    cue.startTime = toSeconds( lineSegments[ 0 ], line );
    cue.endTime = toSeconds( lineSegments[ 2 ], line );
    cue.timecode = line;

    return cue;
}

function toSeconds ( t_in, line ) {
    var t = t_in.split( ":" ),
        l = t_in.length,
        time;

    // Invalid time string provided
    if ( l !== 12 && l !== 9 ) {
        console.log('error', t_in, line);
        return 'ERROR : ' + t_in + ' ' + l;
    }

    l = t.length - 1;

    try {
        time = parseInt( t[ l-1 ], 10 ) * 60 + parseFloat( t[ l ], 10 );

        // Hours were given
        if ( l === 2 ) {
            time += parseInt( t[ 0 ], 10 ) * 3600;
        }
    } catch ( e ) {
        throw "Bad cue: " + t_in;
    }

    return time;
}
