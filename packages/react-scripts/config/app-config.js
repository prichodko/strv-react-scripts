'use strict';

const fs = require('fs');
const paths = require('./paths');

const defaultConfig = {
  webpack: null,
  webpackDevServer: null,
};

const getConfig = () => {
  let userConfig = {};

  if (fs.existsSync(paths.appConfig)) {
    userConfig = require(paths.appConfig);
  }

  return Object.assign(defaultConfig, userConfig);
};

module.exports = getConfig;
