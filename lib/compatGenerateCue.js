"use strict";

module.exports = function generateCue(cue) {
  var state = {};
  var steps = {};

  for (var i in cue) {
    checkOverlap(cue[i], cue);
  }

  var items = cue.map(function (item) {
    return [{ op: "remove", time: parseFloat(item.end), region: item.region, payload: item.payload }, { op: "add", time: parseFloat(item.start), region: item.region, payload: item.payload }];
  });

  items = [].concat.apply([], items).sort(function (a, b) {
    return a.time - b.time;
  }).sort(function (a, b) {
    return a.op === 'add';
  });

  items.forEach(function (item, i) {
    if (item.op === "add") {
      state[item.region] = item.payload;
    } else {
      state[item.region] = [];
    }

    steps[item.time] = steps[item.time] || {};
    steps[item.time][item.region] = state[item.region];
  });

  return steps;
};

function checkOverlap(item, cue) {
  for (var i in cue) {
    if (cue[i] !== item && cue[i].region === item.region && overlaps(item, cue[i])) {
      console.log('overlap');
      console.log(item.chunk.split('\n')[0]);
      console.log(cue[i].chunk.split('\n')[0]);
    }
  }
}

function overlaps(a, b) {
  return a.start < b.end && b.start < a.end;
}