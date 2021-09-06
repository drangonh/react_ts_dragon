// scripts/webpack/webpack-prod-config.js

const { merge } = require('webpack-merge');

const common = require('./webpack.common.config');

module.exports = merge(common, {
  mode: 'production',
});