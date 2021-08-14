import reactRefresh from '@vitejs/plugin-react-refresh'

export default {
  plugins: [reactRefresh()],
  esbuild: {
    // will inject the React import statement to the JSX files
    jsxInject: `import React from 'react';`,
  },
  build: {
    minify: false,
  }
}