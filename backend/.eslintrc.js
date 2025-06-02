module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    // Allow ts-expect-error but not ts-ignore
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': false, // ✅ allow it
        'ts-ignore': true,        // 🚫 disallow it
        'ts-nocheck': true,
        'ts-check': true
      }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json' // Path to tsconfig
      }
    }
  }
};
