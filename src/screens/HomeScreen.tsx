import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { DeviceCard } from '../components/DeviceCard';
import { EmptyState } from '../components/EmptyState';
import { useBluetooth } from '../hooks/useBluetooth';
import { Colors } from '../utils/colors';
import { BluetoothDevice } from '../types/bluetooth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RECENT_DEVICES_KEY } from '../utils/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isDark = useColorScheme() === 'dark';
  const { isEnabled, connectedDevice, disconnect } = useBluetooth();
  const [recentDevices, setRecentDevices] = useState<BluetoothDevice[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadRecentDevices();
    }
  }, [isFocused]);

  const loadRecentDevices = async () => {
    try {
      const data = await AsyncStorage.getItem(RECENT_DEVICES_KEY);
      if (data) {
        setRecentDevices(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load recent devices', e);
    }
  };

  const navigateToChat = (device: BluetoothDevice) => {
    navigation.navigate('Chat', { device });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      <Header 
        title="Offline Chat" 
        rightIcon="bluetooth-searching"
        onRightPress={() => navigation.navigate('NearbyDevices')}
      />

      <View style={styles.statusContainer}>
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: isDark ? Colors.textDark : Colors.text }]}>
            Bluetooth Status:
          </Text>
          <Text style={[styles.statusBadge, { color: isEnabled ? Colors.success : Colors.error }]}>
            {isEnabled ? 'ON' : 'OFF'}
          </Text>
        </View>
        
        {connectedDevice && (
          <TouchableOpacity 
            style={[styles.activeConnection, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}
            onPress={() => navigation.navigate('ConnectionStatus', { device: connectedDevice })}
          >
            <View style={styles.deviceInfo}>
              <Icon name="bluetooth-connected" size={24} color={Colors.primary} />
              <View style={styles.deviceTextContainer}>
                <Text style={[styles.deviceName, { color: isDark ? Colors.textDark : Colors.text }]}>
                  {connectedDevice.name || 'Unknown Device'}
                </Text>
                <Text style={styles.connectedText}>Tap for details</Text>
              </View>
            </View>
            <TouchableOpacity onPress={disconnect} style={styles.disconnectBtn}>
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
          Recent Chats
        </Text>
        <FlatList
          data={recentDevices}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPress={() => navigateToChat(item)}
            />
          )}
          contentContainerStyle={recentDevices.length === 0 && styles.emptyList}
          ListEmptyComponent={
            <EmptyState
              icon="chat-bubble-outline"
              title="No Recent Chats"
              message="Tap the search icon above to find nearby devices and start chatting."
            />
          }
        />
      </View>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: Colors.primary }]}
        onPress={() => navigation.navigate('NearbyDevices')}
      >
        <Icon name="search" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activeConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceTextContainer: {
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedText: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 2,
  },
  disconnectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
  },
  disconnectText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default HomeScreen;
