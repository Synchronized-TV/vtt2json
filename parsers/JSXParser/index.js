const babel = require('babel-core');
import JSXPlugin from './babel-plugin-jsx';

export default function JSXParser(input) {
  if (!input.match(/^<.*>/)) {
    return null;
  }

  let code = null;
  let output = null;

  try {
    code = babel.transform(`<div>${input}</div>`, {
      'plugins': ['syntax-jsx', JSXPlugin]
    }).code;

    // TODO: Safe eval.
    output = eval(code).props.children;
  }
  catch(e) {
    console.error('Could not process input', input);
  }

  return output;
};
