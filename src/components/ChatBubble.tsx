import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Message } from '../types/message';
import { formatTime } from '../utils/helpers';
import { useAppTheme } from '../hooks/useAppTheme';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { width } = useWindowDimensions();
  const { colors, isDark } = useAppTheme();
  const { isSender, text, timestamp } = message;
  const translateY = useSharedValue(10);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 220 });
    translateY.value = withDelay(40, withSpring(0, { damping: 18, stiffness: 180 }));
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        isSender ? styles.senderContainer : styles.receiverContainer,
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isSender ? colors.bubbleRight : colors.bubbleLeft,
            borderColor: isSender ? 'transparent' : colors.border,
            maxWidth: Math.min(width * 0.78, 420),
            shadowColor: colors.shadow,
          },
          isSender ? styles.senderBubble : styles.receiverBubble,
        ]}
      >
        <Text style={[styles.text, { color: isSender && isDark ? '#FFFFFF' : colors.text }]}>
          {text}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.time, { color: isSender && isDark ? 'rgba(255,255,255,0.72)' : colors.textMuted }]}>
            {formatTime(timestamp)}
          </Text>
          {isSender && (
            <Icon
              name="done-all"
              size={15}
              color={isDark ? 'rgba(255,255,255,0.75)' : colors.primary}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginVertical: 4,
  },
  senderContainer: {
    justifyContent: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 1,
    paddingHorizontal: 13,
    paddingTop: 9,
    paddingBottom: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  senderBubble: {
    borderBottomRightRadius: 8,
    borderRadius: 20,
  },
  receiverBubble: {
    borderBottomLeftRadius: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  metaRow: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    marginTop: 5,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
  },
});
