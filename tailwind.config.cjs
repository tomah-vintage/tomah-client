const { skeleton } = require('@skeletonlabs/tw-plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {},
  },
  plugins: [
    skeleton({
      themes: { preset: [ "skeleton" ] }
    })
  ]
}
