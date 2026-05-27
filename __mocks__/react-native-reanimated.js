const ReactNative = require('react-native');

const Reanimated = {
  ...ReactNative.Animated,
  default: ReactNative.Animated,
  createAnimatedComponent: component => component,
  useAnimatedStyle: updater => updater(),
  useSharedValue: value => ({ value }),
  withDelay: (_delay, value) => value,
  withRepeat: value => value,
  withSpring: value => value,
  withTiming: value => value,
  interpolate: (value, input, output) => {
    if (value <= input[0]) return output[0];
    if (value >= input[input.length - 1]) return output[output.length - 1];
    return output[0];
  },
};

module.exports = Reanimated;
