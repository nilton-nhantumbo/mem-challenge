module.exports = {
  presets: [
    [
      '@babel/preset-env',

      {
        useBuiltIns: 'entry',
        targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8', 'ie >= 11'],
        },
      },
    ],
  ],
};
