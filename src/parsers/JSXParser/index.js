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
    //output = output.length > 1 ? output : output[0];
  }
  catch(e) {
    console.error('Could not process input', input);
  }

  return output;
};
