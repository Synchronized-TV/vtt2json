"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.applyPlugins = applyPlugins;
exports.applyPluginsOnce = applyPluginsOnce;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function applyPlugins(plugins, key, input) {
  var results = plugins.filter(function (plugin) {
    return !!plugin[key];
  }).map(function (plugin) {
    return plugin[key](input);
  }).filter(function (result) {
    return result !== undefined;
  });

  return results.length ? _extends.apply(undefined, [{}].concat(_toConsumableArray(results))) : undefined;
}

function applyPluginsOnce(plugins, key, input) {
  var result = void 0;

  for (var i = 0; i < plugins.length; i++) {
    if (plugins[i][key]) {
      result = plugins[i][key](input);

      if (result !== undefined) {
        break;
      }
    }
  }

  return result;
}