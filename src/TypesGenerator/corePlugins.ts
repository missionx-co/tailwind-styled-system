import configurePlugins from 'tailwindcss/lib/util/configurePlugins';
import * as corePluginList from 'tailwindcss/lib/corePluginList';
import * as plugins from 'tailwindcss/lib/plugins';

function corePlugins({ corePlugins: corePluginConfig }) {
  return configurePlugins(corePluginConfig, corePluginList).map(pluginName => {
    return [pluginName, plugins[pluginName]()];
  });
}

export default corePlugins;
