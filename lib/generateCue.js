module.exports = function generateCue(cue) {
    var state = {};
    var timeline = [];
    var steps = {};

    var sorted = cue.items
        .map(function(item) {
          return { op: 'add', time: item.startTime, region: item.region, payload: item.payload };
        })
        .concat(cue.items
            .map(function(item) {
              return { op: 'remove', time: item.endTime, region: item.region, payload: item.payload }
            })
        )
        .sort(function(a, b) {
          return a.time - b.time;
        });

    sorted.forEach(function(item) {
        state[item.region] = state[item.region] || [];

        if (item.op === 'add') {
            state[item.region].push(item.payload);
        }
        else {
            state[item.region] = state[item.region].filter(function(payload) {
              return payload !== item.payload
            });

            if (!state[item.region].length) {
                delete state[item.region];
            }
        }

        steps[item.time] = {};

        for (var i in state) {
            steps[item.time][i] = steps[item.time][i] || [];

            for (var j in state[i]) {
                steps[item.time][i].push(state[i][j]);
            }
        }
    });

    for (var time in steps) {
        timeline.push({
            time: time,
            state: steps[time]
        });
    }

    return timeline;
}
