import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BluetoothDevice } from '../types/bluetooth';
import { useAppTheme } from '../hooks/useAppTheme';
import { AnimatedPressable } from './AnimatedPressable';
import { Avatar } from './Avatar';
import { StatusPill } from './StatusPill';

interface DeviceCardProps {
  device: BluetoothDevice;
  onPress: (device: BluetoothDevice) => void;
  disabled?: boolean;
  caption?: string;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onPress, disabled, caption }) => {
  const { colors } = useAppTheme();
  const connected = Boolean(device.connected);

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity: disabled ? 0.55 : 1,
        },
      ]}
      onPress={() => onPress(device)}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Avatar name={device.name} icon="devices" online={connected} size={52} />
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {device.name || 'Unknown Device'}
        </Text>
        <View style={styles.metaRow}>
          <Icon name={device.bonded ? 'verified' : 'bluetooth'} size={14} color={colors.textMuted} />
          <Text style={[styles.address, { color: colors.textMuted }]} numberOfLines={1}>
            {caption || device.address}
          </Text>
        </View>
      </View>
      {connected ? (
        <StatusPill label="Online" tone="success" />
      ) : device.bonded ? (
        <StatusPill label="Paired" tone="neutral" />
      ) : (
        <Icon name="chevron-right" size={24} color={colors.textMuted} />
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  infoContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  address: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
});
