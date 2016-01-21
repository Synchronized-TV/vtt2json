export default function JSONParser(input) {
  if (!input.match(/^[\{\[]/)) {
    return null;
  }

  return JSON.parse(input);
};
