// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

/**
 * @type import('jest').Config
 */
export default {
  watchman: false,
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[tj]s'],
  transform: { '^.+\\.m?[tj]sx?$': ['@swc/jest'] },
};
