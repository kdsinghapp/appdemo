import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BluetoothDevice } from '../types/bluetooth';
import { Colors } from '../utils/colors';

interface DeviceCardProps {
  device: BluetoothDevice;
  onPress: (device: BluetoothDevice) => void;
  disabled?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, disabled }) => {
  const isDark = useColorScheme() === 'dark';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isDark ? Colors.cardDark : Colors.card, borderColor: isDark ? Colors.borderDark : Colors.border }]}
      onPress={() => onPress(device)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <Icon name={device.bonded ? "bluetooth-connected" : "bluetooth"} size={24} color={device.bonded ? Colors.primary : (isDark ? Colors.textDark : Colors.text)} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: isDark ? Colors.textDark : Colors.text }]} numberOfLines={1}>
          {device.name || 'Unknown Device'}
        </Text>
        <Text style={[styles.address, { color: isDark ? Colors.textMutedDark : Colors.textMuted }]}>
          {device.address}
        </Text>
      </View>
      {device.connected && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Connected</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
  },
  badge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
