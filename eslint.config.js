// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: true,
  pnpm: true,
  rules: {
    'no-console': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  },
},
)
