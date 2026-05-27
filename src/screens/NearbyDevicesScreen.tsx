import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { DeviceCard } from '../components/DeviceCard';
import { EmptyState } from '../components/EmptyState';
import { useBluetooth } from '../hooks/useBluetooth';
import { BluetoothDevice } from '../types/bluetooth';
import { RECENT_DEVICES_KEY } from '../utils/constants';
import { Screen } from '../components/Screen';
import { useAppTheme } from '../hooks/useAppTheme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { LoadingView } from '../components/LoadingView';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NearbyDevices'>;

const NearbyDevicesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppTheme();
  const { isDiscovering, devices, scanDevices, getBonded, connectedDevice } = useBluetooth();

  useEffect(() => {
    getBonded();
  }, [getBonded]);

  const saveRecentDevice = async (device: BluetoothDevice) => {
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
  };

  const handleConnect = async (device: BluetoothDevice) => {
    await saveRecentDevice(device);
    navigation.navigate('Chat', { device });
  };

  return (
    <Screen>
      <Header
        title="Nearby Devices"
        subtitle={isDiscovering ? 'Scanning for paired devices' : `${devices.length} device${devices.length === 1 ? '' : 's'} available`}
        onBack={() => navigation.goBack()}
        rightIcon="refresh"
        onRightPress={scanDevices}
        avatarIcon="bluetooth-searching"
      />

      <View style={styles.content}>
        <View style={[styles.scanPanel, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={[styles.scanIcon, { backgroundColor: colors.primarySoft }]}>
            <Icon name="bluetooth-searching" size={28} color={colors.primary} />
          </View>
          <View style={styles.scanText}>
            <Text style={[styles.scanTitle, { color: colors.text }]}>Device Discovery</Text>
            <Text style={[styles.scanBody, { color: colors.textMuted }]}>
              Pair devices in Android Bluetooth settings, then refresh this list.
            </Text>
          </View>
          <AnimatedPressable
            style={[styles.scanButton, { backgroundColor: colors.primary }]}
            onPress={scanDevices}
            disabled={isDiscovering}
            accessibilityRole="button"
          >
            <Icon name="radar" size={19} color="#FFFFFF" />
          </AnimatedPressable>
        </View>
      </View>

      {isDiscovering ? (
        <LoadingView message="Scanning nearby devices..." />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.address}
          contentContainerStyle={[styles.list, devices.length === 0 && styles.emptyList]}
          renderItem={({ item }) => (
            <DeviceCard
              device={{
                ...item,
                connected: connectedDevice?.address === item.address,
              }}
              caption={item.bonded ? 'Paired and ready' : item.address}
              onPress={handleConnect}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="devices-other"
              title="No devices found"
              message="Make sure Bluetooth is on and the other device is paired before scanning again."
            />
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 0,
  },
  scanPanel: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
  },
  scanIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  scanText: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  scanBody: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 4,
  },
  scanButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default NearbyDevicesScreen;
