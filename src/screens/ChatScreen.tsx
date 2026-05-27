import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/ChatBubble';
import { MessageInput } from '../components/MessageInput';
import { EmptyState } from '../components/EmptyState';
import { TypingIndicator } from '../components/TypingIndicator';
import { DateSeparator } from '../components/DateSeparator';
import { useChat } from '../hooks/useChat';
import { useBluetooth } from '../hooks/useBluetooth';
import { useAppTheme } from '../hooks/useAppTheme';
import { Screen } from '../components/Screen';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { formatDateSeparator } from '../utils/helpers';
import { Message } from '../types/message';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const { device } = route.params;
  const { colors } = useAppTheme();
  const flatListRef = useRef<FlatList<Message>>(null);
  const { connectedDevice, connect } = useBluetooth();
  const isConnected = connectedDevice?.address === device.address;
  const [isConnecting, setIsConnecting] = useState(false);
  const { messages, sendMessage } = useChat(device.address, isConnected);

  const attemptConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await connect({
        id: device.address,
        name: device.name || 'Unknown Device',
        address: device.address,
        bonded: device.bonded || false,
      });
    } catch (e) {
      console.error('Auto-connect failed', e);
    }
    setIsConnecting(false);
  }, [connect, device.address, device.bonded, device.name]);

  useEffect(() => {
    if (!isConnected && !isConnecting) {
      attemptConnect();
    }
  }, [attemptConnect, isConnected, isConnecting]);

  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  const handleSend = async (text: string) => {
    const sent = await sendMessage(text);
    if (sent) {
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
    }
  };

  const statusLabel = isConnected ? 'Online' : isConnecting ? 'Connecting...' : 'Offline';

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const previous = messages[index - 1];
    const showDate = !previous ||
      formatDateSeparator(previous.timestamp) !== formatDateSeparator(item.timestamp);

    return (
      <>
        {showDate && <DateSeparator label={formatDateSeparator(item.timestamp)} />}
        <ChatBubble message={item} />
      </>
    );
  };

  return (
    <Screen edges={['top', 'left', 'right']} style={{ backgroundColor: colors.background }}>
      <Header
        title={device.name || 'Unknown Device'}
        subtitle={statusLabel}
        avatarName={device.name}
        online={isConnected}
        onBack={() => navigation.goBack()}
        rightIcon="info-outline"
        onRightPress={() => navigation.navigate('ConnectionStatus', { device })}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={styles.chatBackground}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.listContent,
              messages.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={
              <EmptyState
                icon="forum"
                title="Start the conversation"
                message="Send a message and it will be delivered directly to this connected device."
              />
            }
            removeClippedSubviews
            initialNumToRender={18}
            maxToRenderPerBatch={12}
            windowSize={8}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />

          {isConnecting && messages.length > 0 && <TypingIndicator />}

          {!isConnected && (
            <View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name={isConnecting ? 'sync' : 'wifi-off'} size={18} color={isConnecting ? colors.warning : colors.error} />
              <Text style={[styles.bannerText, { color: colors.text }]}>
                {isConnecting ? 'Reconnecting to device...' : 'Device is offline'}
              </Text>
              {!isConnecting && (
                <AnimatedPressable style={[styles.retryButton, { backgroundColor: colors.primarySoft }]} onPress={attemptConnect}>
                  <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
                </AnimatedPressable>
              )}
            </View>
          )}
        </View>

        <MessageInput onSend={handleSend} disabled={!isConnected} />
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  chatBackground: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 14,
    paddingTop: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  banner: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    bottom: 10,
    flexDirection: 'row',
    gap: 8,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
    right: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  retryButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '900',
  },
});

export default ChatScreen;
