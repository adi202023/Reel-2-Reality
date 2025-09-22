const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['nativewind']
      }
    },
    argv
  );

  // Add support for TypeScript
  config.resolve.extensions = ['.web.tsx', '.tsx', '.web.ts', '.ts', '.web.jsx', '.jsx', '.web.js', '.js', '.json'];
  
  // Add alias for better imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname, 'src'),
  };

  return config;
};
