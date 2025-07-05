module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base",
    "prettier"
  ],
  "plugins": [
    "prettier"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "error",
    "no-console": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-underscore-dangle": "off",
    "consistent-return": "off",
    "func-names": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }]
  }
};
