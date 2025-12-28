import js from "@eslint/js";
import globals from "globals";

export default [
  // Base recommended rules
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
      /* ========== Code Quality ========== */
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "off",

      /* ========== Best Practices ========== */
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "dot-notation": "error",

      /* ========== Node / Async ========== */
      "no-process-exit": "off",
      "no-return-await": "error",
      "require-await": "warn",

      /* ========== Style (Prettier friendly) ========== */
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      indent: ["error", 2],
    },
  },

  // Ignore files
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "coverage/**"],
  },
];
