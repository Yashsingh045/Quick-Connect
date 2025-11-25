module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        moduleName: "@env",
        path: ".env",
        safe: true,
        allowUndefined: true
      }],
      ["module-resolver", {
        root: ["./"],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          "@": "./src",
          "@assets": "./assets",
          "@components": "./src/components",
          "@screens": "./src/screens",
          "@services": "./src/services",
          "@utils": "./src/utils",
          "@contexts": "./src/contexts"
        }
      }]
    ]
  };
};
