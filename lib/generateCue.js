module.exports = function generateCue(cue) {
    var state = {};
    var timeline = [];
    var steps = {};

    var items = cue.items
        .map(function(item) {
          return { op: 'add', time: parseFloat(item.startTime), region: item.region, payload: item.payload };
        })
        .concat(cue.items
            .map(function(item) {
              return { op: 'remove', time: parseFloat(item.endTime), region: item.region, payload: item.payload }
            })
        );

    items = items.sort(function(a, b) {
      return a.time - b.time;
    });

    items.forEach(function(item) {
        state[item.region] = state[item.region] || [];

        if (item.op === 'add') {
            state[item.region].push(item.payload);
        }
        else {
            state[item.region] = state[item.region].filter(function(payload) {
              return payload !== item.payload;
            });
        }

        steps[item.time] = {};

        for (var i in state) {
            steps[item.time][i] = steps[item.time][i] || [];

            for (var j in state[i]) {
                steps[item.time][i] = state[i][j];
            }
        }
    });

    for (var time in steps) {
        timeline.push({
            time: parseFloat(time),
            state: steps[time]
        });
    }

    return timeline.sort(function(a, b) {
      return a.time - b.time;
    });
}
