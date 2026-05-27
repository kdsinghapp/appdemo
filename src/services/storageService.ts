import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/message';
import { Constants } from '../utils/constants';

export const StorageService = {
  getMessages: async (deviceId: string): Promise<Message[]> => {
    try {
      const key = `${Constants.STORAGE_KEYS.MESSAGES_PREFIX}${deviceId}`;
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading messages:', e);
      return [];
    }
  },

  saveMessage: async (deviceId: string, message: Message): Promise<void> => {
    try {
      const messages = await StorageService.getMessages(deviceId);
      messages.push(message);
      const key = `${Constants.STORAGE_KEYS.MESSAGES_PREFIX}${deviceId}`;
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving message:', e);
    }
  },

  getLastConnectedDevice: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(Constants.STORAGE_KEYS.LAST_CONNECTED_DEVICE);
    } catch (e) {
      console.error('Error reading last connected device:', e);
      return null;
    }
  },

  saveLastConnectedDevice: async (deviceId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(Constants.STORAGE_KEYS.LAST_CONNECTED_DEVICE, deviceId);
    } catch (e) {
      console.error('Error saving last connected device:', e);
    }
  },

  clearMessages: async (deviceId: string): Promise<void> => {
    try {
      const key = `${Constants.STORAGE_KEYS.MESSAGES_PREFIX}${deviceId}`;
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error clearing messages:', e);
    }
  }
};
