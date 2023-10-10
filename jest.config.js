/** @type {import('jest').Config} */
const config = {

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: ['**/src/**/*.js']
}

export default config
