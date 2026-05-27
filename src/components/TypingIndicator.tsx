import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useAppTheme } from '../hooks/useAppTheme';

const Dot = ({ delay }: { delay: number }) => {
  const { colors } = useAppTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withRepeat(withTiming(1, { duration: 620 }), -1, true));
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.35, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -4]) }],
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: colors.textMuted }, style]} />;
};

export const TypingIndicator = () => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bubbleLeft, borderColor: colors.border }]}>
      <Dot delay={0} />
      <Dot delay={120} />
      <Dot delay={240} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 18,
    borderBottomLeftRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 5,
    marginLeft: 14,
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
});
