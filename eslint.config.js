import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off", 
      "strict": ["error", "global"], 
      "eqeqeq": ["error", "always"], 
      "no-var": "error", 
      "prefer-const": "warn", 
    },
  },
  pluginJs.configs.recommended,
];