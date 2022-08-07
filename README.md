## webpack-override-plugin

```javascript
// webpack config
{
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

```