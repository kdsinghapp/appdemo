import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/useAppTheme';
import { AnimatedPressable } from './AnimatedPressable';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const { colors } = useAppTheme();
  const canSend = text.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (canSend) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <View style={[styles.inputContainer, { backgroundColor: colors.input }]}>
        <AnimatedPressable style={styles.smallButton} disabled={disabled} accessibilityRole="button">
          <Icon name="mood" size={23} color={colors.textMuted} />
        </AnimatedPressable>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={disabled ? 'Reconnect to send messages' : 'Message'}
          placeholderTextColor={colors.textMuted}
          multiline
          value={text}
          onChangeText={setText}
          editable={!disabled}
          selectionColor={colors.primary}
          maxLength={1000}
        />
        <AnimatedPressable style={styles.smallButton} disabled={disabled} accessibilityRole="button">
          <Icon name="attach-file" size={22} color={colors.textMuted} />
        </AnimatedPressable>
      </View>
      <AnimatedPressable
        style={[
          styles.sendButton,
          {
            backgroundColor: canSend ? colors.primary : colors.input,
            shadowColor: colors.primary,
          },
        ]}
        onPress={handleSend}
        disabled={!canSend}
        pressedScale={0.9}
        accessibilityRole="button"
      >
        <Icon name="send" size={20} color={canSend ? '#FFFFFF' : colors.textMuted} />
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  inputContainer: {
    alignItems: 'flex-end',
    borderRadius: 25,
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  smallButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 36,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    maxHeight: 112,
    minHeight: 40,
    paddingHorizontal: 4,
    paddingVertical: 9,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 25,
    elevation: 3,
    height: 50,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    width: 50,
  },
});
