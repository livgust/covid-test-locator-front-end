module.exports = {
  ...require('gts/.prettierrc.json'),
  endOfLine: 'auto',
  plugins: [
    "./node_modules/prettier-plugin-jsdoc"
  ],
};
