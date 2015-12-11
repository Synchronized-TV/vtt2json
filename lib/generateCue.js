module.exports = function generateCue(cue) {
  var state = {};
  var steps = {};

  var items = cue.items
    .map(function(item) {
      return [
        { op: "remove", time: parseFloat(item.endTime), region: item.region, payload: item.payload },
        { op: "add", time: parseFloat(item.startTime), region: item.region, payload: item.payload }
      ];
    });

  items = [].concat.apply([], items).sort(function(a, b) {
    return a.time - b.time;
  });
  items = [].concat.apply([], items).sort(function(a, b) {
    return a.op === 'add';
  });

  items.forEach(function(item, i) {
    if (item.op === "add") {
      state[item.region] = item.payload;
    }
    else {
      state[item.region] = [];
    }

    if (cue.regions.indexOf(item.region) === -1) {
      cue.regions.push(item.region);
    }

    steps[item.time] = steps[item.time] || {};
    steps[item.time][item.region] = state[item.region];
  });

  items = [].concat.apply([], items).sort(function(a, b) {
    return a.time - b.time;
  });

  return { regions: cue.regions, cue: steps };
};
