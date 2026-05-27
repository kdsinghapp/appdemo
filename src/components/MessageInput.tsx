import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/colors';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const isDark = useColorScheme() === 'dark';

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      <View style={[styles.inputContainer, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
        <TextInput
          style={[styles.input, { color: isDark ? Colors.textDark : Colors.text }]}
          placeholder="Message"
          placeholderTextColor={isDark ? Colors.textMutedDark : Colors.textMuted}
          multiline
          value={text}
          onChangeText={setText}
          editable={!disabled}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          { backgroundColor: text.trim() && !disabled ? Colors.primary : (isDark ? Colors.cardDark : '#B0BEC5') }
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Icon name="send" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    marginRight: 8,
    minHeight: 48,
    maxHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});
