export function applyPlugins(plugins, key, input) {
  const results = plugins
    .filter(plugin => !!plugin[key])
    .map(plugin => plugin[key](input))
    .filter(result => result !== undefined);

  return results.length ? Object.assign({}, ...results) : undefined;
}

export function applyPluginsOnce(plugins, key, input) {
  let result;

  for (let i = 0; i < plugins.length; i++) {
    if (plugins[i][key]) {
      result = plugins[i][key](input);

      if (result !== undefined) {
        break;
      }
    }
  }

  return result;
}
