module.exports = function generateCue(cue) {
  var state = {};
  var steps = {};

  var items = cue
    .map(function(item) {
      return [
        { op: "remove", time: parseFloat(item.end), region: item.region, payload: item.payload },
        { op: "add", time: parseFloat(item.start), region: item.region, payload: item.payload }
      ];
    });

  items = [].concat.apply([], items).sort(function(a, b) {
    return a.time - b.time;
  }).sort(function(a, b) {
    return a.op === 'add';
  });

  items.forEach(function(item, i) {
    if (item.op === "add") {
      state[item.region] = item.payload;
    }
    else {
      state[item.region] = [];
    }

    steps[item.time] = steps[item.time] || {};
    steps[item.time][item.region] = state[item.region];
  });

  return steps;
};
