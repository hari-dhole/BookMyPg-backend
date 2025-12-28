const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  // ESLint recommended rules
  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },

    rules: {
      /* Code Quality */
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",

      /* Best Practices */
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],

      /* Async / Node */
      "require-await": "warn",
      "no-return-await": "error",

      /* Style */
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
    },
  },

  {
    ignores: ["node_modules/**", "dist/**", "coverage/**"],
  },
];
