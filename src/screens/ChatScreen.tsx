import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, useColorScheme, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/ChatBubble';
import { MessageInput } from '../components/MessageInput';
import { EmptyState } from '../components/EmptyState';
import { useChat } from '../hooks/useChat';
import { useBluetooth } from '../hooks/useBluetooth';
import { Colors } from '../utils/colors';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ChatScreenRouteProp>();
  const { device } = route.params;
  const isDark = useColorScheme() === 'dark';
  const flatListRef = useRef<FlatList>(null);

  const { connectedDevice, connectionState, connect } = useBluetooth();
  const isConnected = connectedDevice?.address === device.address;
  const [isConnecting, setIsConnecting] = useState(false);

  // Pass isConnected so useChat only listens when device is actually connected
  const { messages, sendMessage } = useChat(device.address, isConnected);

  // Auto-connect when chat screen opens
  useEffect(() => {
    if (!isConnected && !isConnecting) {
      attemptConnect();
    }
  }, []);

  const attemptConnect = async () => {
    setIsConnecting(true);
    try {
      await connect({
        id: device.address,
        name: device.name || 'Unknown',
        address: device.address,
        bonded: device.bonded || false,
      });
    } catch (e) {
      console.error('Auto-connect failed', e);
    }
    setIsConnecting(false);
  };

  const handleSend = async (text: string) => {
    if (text.trim().length > 0) {
      await sendMessage(text.trim());
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const getSubtitle = () => {
    if (isConnected) return 'Connected';
    if (isConnecting) return 'Connecting...';
    return 'Disconnected';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : '#E5DDD5' }]}>
      <Header 
        title={device.name || 'Unknown Device'} 
        subtitle={getSubtitle()}
        onBack={() => navigation.goBack()}
        rightIcon="info-outline"
        onRightPress={() => navigation.navigate('ConnectionStatus', { device })}
      />

      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble message={item} />
          )}
          inverted // WhatsApp style, new messages at bottom
          contentContainerStyle={messages.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <EmptyState
              icon="chat"
              title="No Messages"
              message="Send a message to start chatting."
            />
          }
        />
        
        {!isConnected && (
          <View style={[styles.disconnectedBanner, { backgroundColor: isDark ? Colors.cardDark : '#FFF8E1' }]}>
            <Text style={[styles.disconnectedText, { color: isDark ? Colors.textDark : Colors.textMuted }]}>
              {isConnecting 
                ? 'Connecting to device...' 
                : 'Device is disconnected.'}
            </Text>
            {!isConnecting && (
              <Text 
                style={styles.retryText} 
                onPress={attemptConnect}
              >
                Tap to Retry
              </Text>
            )}
          </View>
        )}

        <MessageInput 
          onSend={handleSend} 
          disabled={!isConnected}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    transform: [{ scaleY: -1 }] // Due to inverted list
  },
  disconnectedBanner: {
    padding: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  disconnectedText: {
    fontSize: 12,
  },
  retryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 4,
    paddingVertical: 4,
  },
});

export default ChatScreen;
