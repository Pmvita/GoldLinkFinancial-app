// Matches the style of apps/web/src/app/App.tsx:
// single quotes for JS strings (Prettier default keeps JSX attributes double-quoted),
// 2-space indent, semicolons, trailing commas where ES5 allows.
/** @type {import("prettier").Config} */
export default {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  trailingComma: 'es5',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
};
