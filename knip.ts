import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['./src/main.tsx','vite.config.ts'],
  project: ['./src/**/*.tsx', './src/**/*.ts'],
  ignore: ['src/vite-env.d.ts', 'src/app/assets/**', 'src/canoe/**', 'src/generated.ts'],
}

export default config
