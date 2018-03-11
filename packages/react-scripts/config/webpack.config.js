'use strict';

const fs = require('fs');
const chalk = require('chalk');
const paths = require('./paths');

const babelConfig = ({ dev, output }) => {
  const babelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };

  const hasBabelRc = fs.existsSync(paths.appBabelRc);

  if (hasBabelRc) {
    output.push(`${chalk.yellow('⚠️  Using external babel configuration')}`);
  } else {
    babelOptions.babelrc = false;
    babelOptions.presets.push(require.resolve('babel-preset-react-app'));
  }

  if (!dev) {
    babelOptions.compact = true;
  }

  return babelOptions;
};

// const eslintConfig = ({ output }) => {
//   const eslintOptions = {
//     formatter: eslintFormatter,
//     eslintPath: require.resolve('eslint'),
//     ignore: false,
//     useEslintrc: true,
//   };

//   const hasEslintRc = fs.existsSync(paths.appEslintRc);

//   if (hasEslintRc) {
//     output.push(`${chalk.yellow('⚠️  Using external eslint configuration')}`);
//   } else {
//     eslintOptions.baseConfig = {
//       extends: [require.resolve('eslint-config-react-app')],
//     };
//     eslintOptions.useEslintrc = false;
//   }

//   return eslintOptions;
// };

const createWebpackConfig = ({ appConfig, dev = false }) => {
  const output = [];
  const babelLoaderOptions = babelConfig({ dev, output });
  // const eslintLoaderOptions = eslintConfig({ output });

  const loaders = {
    babel: {
      loader: require.resolve('babel-loader'),
      options: babelLoaderOptions,
    },
    // eslint: {
    //   loader: require.resolve('eslint-loader'),
    //   options: eslintLoaderOptions,
    // },
  };

  let config;
  if (dev) {
    config = require('./webpack.config.dev')(loaders);
  } else {
    config = require('./webpack.config.prod')(loaders);
  }

  if (typeof appConfig.webpack === 'function') {
    output.push(`${chalk.yellow('⚠️  Using external webpack configuration')}`);
    config = appConfig.webpack(config, { dev });
  }

  return { config, output };
};

module.exports = createWebpackConfig;
