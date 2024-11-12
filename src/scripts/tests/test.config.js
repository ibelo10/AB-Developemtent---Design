// src/scripts/tests/test.config.js
const path = require("path");
const rootDir = path.resolve(__dirname, "../../../");

module.exports = {
  // Root directory
  rootDir: rootDir,

  // Test environment
  testEnvironment: "jsdom",

  // Setup files
  setupFilesAfterEnv: [path.resolve(__dirname, "./setup.js")],

  // Module name mapping
  moduleNameMapper: {
    "^@/(.*)$": path.resolve(rootDir, "src/$1"),
    "^../../config/(.*)$": path.resolve(rootDir, "src/scripts/config/$1"),
    "^../device-preview/(.*)$": path.resolve(
      rootDir,
      "src/scripts/components/device-preview/$1"
    ),
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // Files to test
  testMatch: [path.resolve(rootDir, "src/scripts/tests/components/*.test.js")],

  // Coverage collection
  collectCoverageFrom: [
    "src/scripts/components/**/*.js",
    "src/scripts/core/**/*.js",
    "src/scripts/utils/**/*.js",
    "!src/scripts/tests/**",
  ],

  // Coverage configuration
  coverageDirectory: "./scripts/tools/reports/coverage",
  coverageReporters: ["text", "html", "json", "lcov", "cobertura"],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Transform configuration (single entry)
  transform: {
    "^.+\\.js$": [
      "babel-jest",
      {
        configFile: path.resolve(rootDir, "babel.config.js"),
      },
    ],
  },

  // Report configuration
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "AB Development & Design - Test Report",
        outputPath: "./scripts/tools/reports/test-results/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        includeGlobalCSS: true,
        globalCSS: ".test-result{margin-bottom:10px}",
        styleOverridePath: "./src/scripts/tests/custom-style.css",
        customScriptPath: "./src/scripts/tests/custom-script.js",
        sort: "status",
        statusIgnoreFilter: null,
        dateFormat: "yyyy-mm-dd HH:MM:ss",
        executionTimeWarningThreshold: 5,
        executionTimeErrorThreshold: 10,
        expanded: true,
      },
    ],
    [
      "jest-junit",
      {
        outputDirectory: "./scripts/tools/reports/test-results",
        outputName: "junit.xml",
        classNameTemplate: "{classname}",
        titleTemplate: "{title}",
        ancestorSeparator: " › ",
        usePathForSuiteName: true,
      },
    ],
  ],

  // Module file extensions
  moduleFileExtensions: ["js", "json"],

  // Test environment options
  testEnvironmentOptions: {
    url: "http://localhost",
  },

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/OldSetup/"],

  // Watch plugins
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],

  // Error handling
  errorOnDeprecated: true,
  bail: false,
  verbose: true,

  // Timing
  testTimeout: 5000,
  slowTestThreshold: 3000,
};
