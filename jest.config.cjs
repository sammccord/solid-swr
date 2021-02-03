module.exports = {
  verbose: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/*.d.ts'
  ],
  transformIgnorePatterns: ['node_modules/?!(dom-expressions)'],
  setupFiles: [
      "./test/setup.js"
  ]
}
