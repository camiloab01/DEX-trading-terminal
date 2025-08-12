import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path, { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
// import eslint from '@nabla/vite-plugin-eslint'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const penv = process.env
  return defineConfig({
    optimizeDeps: {
      include: ['@uniswap/v3-sdk'],
    },
    resolve: {
      alias: {
        jsbi: path.resolve(
          __dirname,
          'node_modules',
          'jsbi',
          'dist',
          'jsbi-cjs.js'
        ),
      },
    },
    define: {
      'process.env': {
        ...penv,
      },
    },
    plugins: [
      nodePolyfills({
        include: ['stream'],
      }),
      react({
        devTarget: 'es2022',
        plugins: [['@lingui/swc-plugin', {}]],
      }),
      lingui(),
      // eslint(),
      visualizer({
        sourcemap: true,
      }),
    ],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('echarts') || id.includes('zrender')) {
              return 'charting'
            }
            if (
              id.includes('multibase') ||
              id.includes('firebase') ||
              id.includes('sentry')
            ) {
              return 'userinfo'
            }
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
        },
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        onwarn: (message, next) => {
          if (/comment will be removed/.test(message.message)) {
            return
          }
          next(message)
        },
      },
    },
  })
}
