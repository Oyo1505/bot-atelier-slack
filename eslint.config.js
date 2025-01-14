import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [

  {
    files: ["**/*.ts", "**/*.js"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
  ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: parserTs,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off", 
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "strict": ["error", "global"],
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
 
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off", 
    },
  },
];