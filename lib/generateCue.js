module.exports = function generateCue(cue) {
  var state = {};
  var steps = {};
  var regions = [];

  var items = cue.items
    .map(function(item) {
      return { op: "add", time: parseFloat(item.startTime), region: item.region, payload: item.payload };
    })
    .concat(cue.items
      .map(function(item) {
        return { op: "remove", time: parseFloat(item.endTime), region: item.region, payload: item.payload };
      })
    );

  items = items.sort(function(a, b) {
    return a.time - b.time;
  });

  items.forEach(function(item) {
    state[item.region] = state[item.region] || [];

    if (item.op === "add") {
      state[item.region] = Array.isArray(state[item.region]) && Array.isArray(item.payload) ?
        state[item.region].concat(item.payload) :
        state[item.region] = item.payload;
    }
    else {
      state[item.region] = Array.isArray(state[item.region]) && Array.isArray(item.payload) ?
        state[item.region].filter(function(payload) {
          return item.payload.indexOf(payload) === -1;
        }) : [];
    }

    if (regions.indexOf(item.region) === -1) {
      regions.push(item.region);
    }

    steps[item.time] = steps[item.time] || {};
    steps[item.time][item.region] = state[item.region];
  });

  return { regions: regions, cue: steps };
};
