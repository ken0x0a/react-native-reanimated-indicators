module.exports = {
  extends: ['@ken0x0a/eslint-config'],
  rules: {
    'no-underscore-dangle': 0,
    // 'react/no-array-index-key': 0,
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/array-type': 0,
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
    '@typescript-eslint/no-unused-vars': 0, // typescript has better checking
    '@typescript-eslint/no-use-before-define': 0, // typescript has better checking
  },
}
