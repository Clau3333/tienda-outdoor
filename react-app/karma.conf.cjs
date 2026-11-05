const { mkdirSync, writeFileSync } = require('node:fs')
const path = require('node:path')

// Evidencia de ejecución, sin atribuir porcentajes de cobertura de código.
function AcademicReporter(baseReporterDecorator) {
  baseReporterDecorator(this)
  const specs = []
  this.onSpecComplete = (browser, result) => {
    specs.push({ browser: browser.name, name: result.fullName ?? [...result.suite, result.description].join(' '),
      success: result.success, skipped: result.skipped, timeMs: result.time, log: result.log })
    this.write('%s %s\n', result.skipped ? 'SKIP' : result.success ? 'PASS' : 'FAIL', specs.at(-1).name)
  }
  this.onRunComplete = (browsers, results) => {
    const directory = path.join(__dirname, 'test-results')
    mkdirSync(directory, { recursive: true })
    writeFileSync(path.join(directory, 'jasmine-karma.json'), JSON.stringify({
      timestamp: new Date().toISOString(), framework: 'Jasmine', runner: 'Karma',
      versions: { karma: require('karma/package.json').version, jasmine: require('jasmine-core/package.json').version },
      browsers: browsers.map((browser) => browser.name),
      passed: results.success, failed: results.failed, skipped: results.skipped,
      error: results.error, disconnected: results.disconnected, exitCode: results.exitCode, specs,
    }, null, 2) + '\n')
  }
}
AcademicReporter.$inject = ['baseReporterDecorator']

module.exports = function (config) {
  config.set({
    basePath: __dirname,
    frameworks: ['jasmine'],
    files: [
      { pattern: '.karma-tmp/specs.js', watched: false },
      { pattern: '../Sitio Old/img/logo-albedo.png', included: false, served: true, watched: false },
    ],
    proxies: {
      '/Sitio%20Old/img/logo-albedo.png': '/absolute' + path.resolve(__dirname, '../Sitio Old/img/logo-albedo.png').replace(/\\/g, '/'),
    },
    plugins: ['karma-jasmine', 'karma-chrome-launcher', { 'reporter:academic': ['type', AcademicReporter] }],
    reporters: ['progress', 'academic'],
    browsers: ['ChromeHeadless'],
    hostname: '127.0.0.1', listenAddress: '127.0.0.1', port: 9876,
    singleRun: true, autoWatch: false,
    failOnEmptyTestSuite: true,
    browserNoActivityTimeout: 30000,
    client: { jasmine: { random: true, seed: '20261104', failSpecWithNoExpectations: true } },
  })
}
