module.exports = {
  extends: ['@ken0x0a/eslint-config'],
  rules: {
    '@typescript-eslint/camelcase': [
      'error',
      /**
       * - m: minus
       * - p: plus
       * - d: divide
       * - t: times (multiply)
       */
      { allow: ['^UNSAFE_', '_m\\d+$', '_p\\d+$', '_d\\d+$', '_t\\d+$'] },
    ],
  },
}
