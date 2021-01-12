import path from 'path';
import chalk from 'chalk';
import glob from 'fast-glob';
import getValue from 'lodash/get';
import toPath from 'lodash/toPath';

import normalizePath from 'normalize-path';
import resolveConfig from 'tailwindcss/resolveConfig';
import prefixSelector from 'tailwindcss/lib/util/prefixSelector';
import transformThemeValue from 'tailwindcss/lib/util/transformThemeValue';
import escapeClassName from 'tailwindcss/lib/util/escapeClassName';
import corePlugins from './corePlugins';
import TypeGenerator from './Adapters/TypeGenerator';

export default class ReactTailwindTypesGenerator {
  adapter: TypeGenerator;

  CONFIG_GLOB =
    '**/{tailwind,tailwind.config,tailwind-config,.tailwindrc}.{js,cjs}';

  constructor(adapter) {
    this.adapter = adapter;
  }

  private async findTailwindConfigFile(): Promise<string> {
    const configPaths = await glob(this.CONFIG_GLOB, {
      cwd: process.cwd(),
      ignore: ['**/node_modules'],
      onlyFiles: true,
      absolute: true,
      suppressErrors: true,
    });

    configPaths
      .map(normalizePath)
      .sort((a: string, b: string) => a.split('/').length - b.split('/').length)
      .map(path.normalize);

    if (configPaths.length <= 0) {
      console.log(chalk.red`'No Tailwind CSS config found.'`);
      throw new Error();
    }

    const configPath = configPaths[0];
    console.log(
      chalk.white`Found Tailwind config file: `,
      chalk.blue`${configPath}`
    );
    return configPath;
  }

  async run() {
    const configPath = await this.findTailwindConfigFile();
    const fullConfig = resolveConfig(require(configPath));
    const plugins = [...corePlugins(fullConfig)];
    const getConfigValue = (path, defaultValue) =>
      path ? getValue(fullConfig, path, defaultValue) : fullConfig;

    const applyConfiguredPrefix = selector => {
      return prefixSelector(fullConfig.prefix, selector);
    };

    const screens = getValue(fullConfig, 'theme.screens', {});

    plugins.forEach(pluginData => {
      let pluginName = pluginData[0];
      console.log(chalk.white`generating Type for :`, chalk.green(pluginName));
      let plugin = pluginData[1];

      if (plugin.__isOptionsFunction) {
        plugin = plugin();
      }

      const handler =
        typeof plugin === 'function'
          ? plugin
          : plugin.handler
          ? plugin.handler
          : () => {};

      handler({
        variants: (path, defaultValue) => {
          if (Array.isArray(fullConfig.variants)) {
            return fullConfig.variants;
          }

          return getConfigValue(`variants.${path}`, defaultValue);
        },

        theme: (path, defaultValue) => {
          const [pathRoot, ...subPaths] = toPath(path);
          const value = getConfigValue(
            ['theme', pathRoot, ...subPaths],
            defaultValue
          );

          return transformThemeValue(pathRoot)(value);
        },

        corePlugins: path => {
          if (Array.isArray(fullConfig.corePlugins)) {
            return fullConfig.corePlugins.includes(path);
          }

          return getConfigValue(`corePlugins.${path}`, true);
        },

        e: escapeClassName,
        prefix: applyConfiguredPrefix,

        addBase: () => {},
        addComponents: () => {},
        addVariant: () => {},
        addUtilities: this.adapter.generate.bind(
          this.adapter,
          pluginName,
          screens,
          fullConfig.separator || ':'
        ),
      });
    });
  }
}
