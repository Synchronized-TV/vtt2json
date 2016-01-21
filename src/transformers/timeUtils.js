export function timestampToSeconds(timestamp) {
  var t = timestamp.split( ":" ),
    l = timestamp.length,
    time;

  if (l !== 12 && l !== 9) {
    throw "Bad timestamp: " + timestamp;
  }

  l = t.length - 1;

  time = parseInt(t[l-1], 10 ) * 60 + parseFloat(t[l], 10);

  // Hours were given
  if (l === 2) {
    time += parseInt(t[0], 10) * 3600;
  }

  return time;
}
