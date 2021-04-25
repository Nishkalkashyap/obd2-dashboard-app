// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-bluetooth-classic': {
      platforms: {
        ios: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
