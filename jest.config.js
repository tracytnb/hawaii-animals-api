/**
 * Jest configuration
 * - Use ts-jest to process TypeScript files
 * - Use a Node environment
 * - Look for test files under a tests folder with names ending in .test.ts or .test.js
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.(ts|js)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
