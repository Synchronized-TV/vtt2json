import * as babel from 'babel-core';
import jsxjsPlugin from './babel-plugin-jsxjs';

export default function JSXJS(code) {
  return babel.transform(code, {
    'plugins': ['syntax-jsx', jsxjsPlugin]
  }).code;
};
