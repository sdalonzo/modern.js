import path from 'path';
import appTools, { defineConfig } from '@modern-js/app-tools';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const tsconfigFile = path.join(__dirname, './tsconfig.json');
console.info('tsconfigFile', tsconfigFile);

export default defineConfig({
  runtime: {
    state: true,
  },
  plugins: [
    appTools({
      bundler:
        process.env.PROVIDE_TYPE === 'rspack'
          ? 'experimental-rspack'
          : 'webpack',
    }),
  ],
  experiments: {
    sourceBuild: true,
  },
  tools: {
    webpackChain(chain) {
      chain.resolve
        .plugin('tsconfig-paths-webpack-plugin')
        .use(TsconfigPathsPlugin, [
          {
            configFile: tsconfigFile,
            logLevel: 'INFO',
            extensions: chain.resolve.extensions.values(),
            mainFields: ['browser', 'module', 'main'],
            references: [
              '../components/tsconfig.json', // 直接依赖：app->components
              '../utils/tsconfig.json', // 间接依赖：app->components->utils
            ],
            // baseUrl: "/foo"
          },
        ]);
    },
  },
});
