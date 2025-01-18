import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/"], // Ignore the dist directory
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Apply to all JS and TS files
    rules: {},
  },
  {
    files: ["**/*.js"], // Apply to JS files
    languageOptions: {
      sourceType: "commonjs", // Set sourceType to CommonJS for JS files
    },
  },
  {
    languageOptions: {
      globals: globals.node, // Use Node.js globals
    },
  },
  pluginJs.configs.recommended, // Apply ESLint recommended rules
  ...tseslint.configs.recommended, // Apply TypeScript ESLint recommended rules
  {
    // Custom rules for TypeScript files
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule to allow `as any`
    },
  },
];
