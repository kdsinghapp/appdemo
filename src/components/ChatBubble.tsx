import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Message } from '../types/message';
import { formatTime } from '../utils/helpers';
import { Colors } from '../utils/colors';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isDark = useColorScheme() === 'dark';
  const { isSender, text, timestamp } = message;

  return (
    <View style={[styles.container, isSender ? styles.senderContainer : styles.receiverContainer]}>
      <View
        style={[
          styles.bubble,
          isSender
            ? { backgroundColor: isDark ? Colors.bubbleRightDark : Colors.bubbleRight }
            : { backgroundColor: isDark ? Colors.bubbleLeftDark : Colors.bubbleLeft },
        ]}
      >
        <Text style={[styles.text, { color: isDark ? Colors.textDark : Colors.text }]}>
          {text}
        </Text>
        <Text style={[styles.time, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  senderContainer: {
    justifyContent: 'flex-end',
  },
  receiverContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
