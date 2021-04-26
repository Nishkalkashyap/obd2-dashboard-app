// react-native.config.js
module.exports = {
  assets: ['./src/assets/fonts/'], // stays the sam
  dependencies: {
    'react-native-bluetooth-classic': {
      platforms: {
        ios: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
    'react-native-http-bridge': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
