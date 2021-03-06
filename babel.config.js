module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    plugins: [
      [
        'module-resolver',
        {
          'root': ['./'],
          'alias': {
            '$assets': './assets',
            '$src': './src',
          }
        }
      ]
    ]
  };
};
