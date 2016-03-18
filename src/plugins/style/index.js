export function headerParser(input) {
  let styles = [];
  let matches;
  let re = /(<style>[\s\S]*<\/style>)/g;

  while (matches = re.exec(input)) {
    if (matches[1]) {
      styles.push(matches[1]);
    }
  }

  return styles.length ? {
    styles: styles
  } : undefined;
};

export function cueBodyParser(input) {
  return input.match(/^<style>/) ? {
    style: input
  } : undefined;
};
