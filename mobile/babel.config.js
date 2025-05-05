module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./assets",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@services/*": "./services",
            "@navigation": "./src/navigation",
            "@appTypes": "./src/appTypes",
            "@utils": "./src/utils",
          },
        },
      ],
      "nativewind/babel",
      'react-native-reanimated/plugin',
    ],
  };
};
