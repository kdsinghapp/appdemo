import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { DeviceCard } from '../components/DeviceCard';
import { EmptyState } from '../components/EmptyState';
import { useBluetooth } from '../hooks/useBluetooth';
import { Colors } from '../utils/colors';
import { BluetoothDevice } from '../types/bluetooth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RECENT_DEVICES_KEY } from '../utils/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NearbyDevices'>;

const NearbyDevicesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isDark = useColorScheme() === 'dark';
  
  const { 
    isDiscovering, 
    devices,
    scanDevices, 
    getBonded,
    connect,
    connectedDevice
  } = useBluetooth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBonded();
  }, []);

  const handleConnect = async (device: BluetoothDevice) => {
    // Save to recent devices
    try {
      const data = await AsyncStorage.getItem(RECENT_DEVICES_KEY);
      let recent: BluetoothDevice[] = data ? JSON.parse(data) : [];
      recent = recent.filter(d => d.address !== device.address);
      recent.unshift(device);
      if (recent.length > 10) recent.pop();
      await AsyncStorage.setItem(RECENT_DEVICES_KEY, JSON.stringify(recent));
    } catch (e) {
      console.error('Error saving recent device', e);
    }

    // Navigate to chat screen
    navigation.navigate('Chat', { device: device as any });
  };

  const handleScan = () => {
    scanDevices();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      <Header 
        title="Nearby Devices" 
        onBack={() => navigation.goBack()}
        rightIcon={isDiscovering ? undefined : 'refresh'}
        onRightPress={handleScan}
      />

      {/* Scan Button */}
      {!isDiscovering && (
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Text style={styles.scanButtonText}>🔍 Scan for New Devices</Text>
        </TouchableOpacity>
      )}

      {isDiscovering && (
        <View style={styles.scanningRow}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={[styles.scanningText, { color: isDark ? Colors.textDark : Colors.textMuted }]}>
            Scanning for devices...
          </Text>
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() => handleConnect(item)}
          />
        )}
        contentContainerStyle={devices.length === 0 && styles.emptyList}
        ListEmptyComponent={
          <EmptyState
            icon="bluetooth-searching"
            title="No Devices Found"
            message="Make sure Bluetooth is ON on both devices and they are paired via Android Settings > Bluetooth."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
  },
  scanButton: {
    margin: 16,
    padding: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  scanningText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default NearbyDevicesScreen;
