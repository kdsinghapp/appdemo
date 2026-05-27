import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types/message';
import { StorageService } from '../services/storageService';
import BluetoothService from '../bluetooth/BluetoothService';
import { generateMessageId } from '../utils/helpers';
import { BluetoothEventSubscription } from 'react-native-bluetooth-classic';

/**
 * useChat hook - manages messages for a specific device.
 * @param deviceId - The Bluetooth address of the device
 * @param isConnected - Whether the device is currently connected (controls read listener)
 */
export const useChat = (deviceId: string | undefined, isConnected: boolean = false) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load saved messages when deviceId changes
  useEffect(() => {
    if (deviceId) {
      loadMessages(deviceId);
    }
  }, [deviceId]);

  // Only set up read listener when device is actually connected
  useEffect(() => {
    let readSub: BluetoothEventSubscription | null = null;

    if (deviceId && isConnected) {
      try {
        readSub = BluetoothService.onDeviceRead(deviceId, (data) => {
          const text = data.trim();
          if (text) {
            const newMessage: Message = {
              id: generateMessageId(),
              text,
              timestamp: Date.now(),
              isSender: false,
              senderId: deviceId,
            };

            setMessages(prev => [...prev, newMessage]);
            StorageService.saveMessage(deviceId, newMessage);
          }
        });
      } catch (e) {
        console.warn('Could not set up read listener (device may not be connected yet)', e);
      }
    }

    return () => {
      readSub?.remove();
    };
  }, [deviceId, isConnected]); // Re-run when connection state changes

  const loadMessages = async (id: string) => {
    try {
      const loaded = await StorageService.getMessages(id);
      setMessages(loaded);
    } catch (e) {
      console.error('Error loading messages', e);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!deviceId || !text.trim()) return false;

    try {
      const success = await BluetoothService.sendMessage(deviceId, text);
      if (success) {
        const newMessage: Message = {
          id: generateMessageId(),
          text,
          timestamp: Date.now(),
          isSender: true,
          receiverId: deviceId,
        };

        setMessages(prev => [...prev, newMessage]);
        await StorageService.saveMessage(deviceId, newMessage);
        return true;
      }
    } catch (e) {
      console.error('Error sending message', e);
    }
    return false;
  }, [deviceId]);

  return { messages, sendMessage, loadMessages: () => deviceId && loadMessages(deviceId) };
};
