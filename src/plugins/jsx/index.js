const babel = require('babel-core');
import syntaxJSX from 'babel-plugin-syntax-jsx';
import objectJSX from './babel-plugin-object-jsx';

export function cueBodyParser(input) {
  if (!input.match(/^<.*>/)) {
    return undefined;
  }

  let code = null;
  let output = undefined;

  try {
    code = babel.transform(`<div>${input}</div>`, {
      'plugins': [syntaxJSX, objectJSX]
    }).code;

    output = eval(code).props.children;
    output = output.length > 1 ? output : output[0];
  }
  catch(e) {
    console.error('Could not process input', input);
  }

  return output !== undefined ? {
    jsx: output
  } : undefined;
};
