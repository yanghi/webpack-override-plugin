const path = require('path')
const resolve = (p) => path.resolve(__dirname, p)
const OverridePlugin = require('../../..')

module.exports = {
  entry: {
    main: resolve('./src/index.ts')
  },
  resolve: {
    alias: {
      'shared': path.resolve(__dirname, '../shared/lib/index.js')
    },
    extensions: ['.ts', '.js', '.tsx'],
  },
  externals: {
    'react': 'react'
  },
  devtool: false,
  module: {
    rules: [
      { test: /\.tsx?$/, use: [{ loader: 'ts-loader'}] }
    ]
  },

  plugins: [
    new OverridePlugin({
      overrides: [
        {
          context: resolve('./src/overrides'),
          target: resolve('../shared/lib')
        }
      ]
    })
  ]
}