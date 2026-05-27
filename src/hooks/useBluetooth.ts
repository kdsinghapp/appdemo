import { useState, useEffect, useCallback, useRef } from 'react';
import BluetoothService from '../bluetooth/BluetoothService';
import { BluetoothDevice, ConnectionState } from '../types/bluetooth';
import RNBluetoothClassic, { BluetoothEventSubscription } from 'react-native-bluetooth-classic';

export const useBluetooth = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
  const [pairedDevices, setPairedDevices] = useState<BluetoothDevice[]>([]);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const isAccepting = useRef<boolean>(false);

  // Check if Bluetooth is enabled
  const checkBluetoothState = useCallback(async () => {
    try {
      const enabled = await BluetoothService.isBluetoothEnabled();
      setIsEnabled(enabled);
      if (!enabled) {
        const requested = await BluetoothService.requestBluetoothEnabled();
        setIsEnabled(requested);
      }
    } catch (e) {
      console.error('Error checking BT state', e);
    }
  }, []);

  // Get already paired/bonded devices
  const getBonded = useCallback(async () => {
    try {
      const bonded = await BluetoothService.getBondedDevices();
      setPairedDevices(bonded);
      return bonded;
    } catch (e) {
      console.error('Error getting bonded devices', e);
      return [];
    }
  }, []);

  // Scan for nearby devices
  const scanDevices = useCallback(async () => {
    try {
      setIsDiscovering(true);
      const found = await BluetoothService.startDiscovery();
      setDiscoveredDevices(found);
      setIsDiscovering(false);
    } catch (e) {
      console.error('Error scanning', e);
      setIsDiscovering(false);
    }
  }, []);

  // Accept incoming connections (server mode)
  const startAccepting = useCallback(async () => {
    if (isAccepting.current) return;
    isAccepting.current = true;

    try {
      const device = await BluetoothService.acceptConnection();
      if (device) {
        setConnectionState(ConnectionState.CONNECTED);
        setConnectedDevice({
          id: device.address,
          name: device.name || 'Unknown Device',
          address: device.address,
          bonded: Boolean(device.bonded),
          connected: true,
        });
      }
    } catch (e) {
      // Accept was cancelled or failed, that's ok
      console.log('Accept ended', e);
    }
    isAccepting.current = false;
  }, []);

  // Connect as client to a device
  const connect = useCallback(async (device: BluetoothDevice) => {
    try {
      // Stop accepting while we connect as client
      if (isAccepting.current) {
        await BluetoothService.cancelAccept();
        isAccepting.current = false;
      }

      setConnectionState(ConnectionState.CONNECTING);
      const success = await BluetoothService.connectToDevice(device.address);
      
      if (success) {
        setConnectionState(ConnectionState.CONNECTED);
        setConnectedDevice({ ...device, connected: true });
        return true;
      } else {
        setConnectionState(ConnectionState.DISCONNECTED);
        // Resume accepting after failed connect
        startAccepting();
        return false;
      }
    } catch (e) {
      console.error('Error connecting', e);
      setConnectionState(ConnectionState.ERROR);
      startAccepting();
      return false;
    }
  }, [startAccepting]);

  // Disconnect from current device
  const disconnect = useCallback(async () => {
    if (connectedDevice) {
      try {
        setConnectionState(ConnectionState.DISCONNECTING);
        await BluetoothService.disconnectDevice(connectedDevice.address);
      } catch (e) {
        console.error('Error disconnecting', e);
      }
      setConnectionState(ConnectionState.DISCONNECTED);
      setConnectedDevice(null);
      // Resume accepting
      startAccepting();
    }
  }, [connectedDevice, startAccepting]);

  // Initialize on mount
  useEffect(() => {
    let stateSub: BluetoothEventSubscription | null = null;
    let disabledSub: BluetoothEventSubscription | null = null;
    let disconnectSub: BluetoothEventSubscription | null = null;

    const init = async () => {
      await checkBluetoothState();
      await getBonded();
      // Start listening for incoming connections
      startAccepting();
    };

    init();

    try {
      stateSub = RNBluetoothClassic.onBluetoothEnabled(() => setIsEnabled(true));
      disabledSub = RNBluetoothClassic.onBluetoothDisabled(() => setIsEnabled(false));
      disconnectSub = BluetoothService.onDeviceDisconnected(() => {
        setConnectionState(ConnectionState.DISCONNECTED);
        setConnectedDevice(null);
        // Resume accepting after remote device disconnects
        startAccepting();
      });
    } catch (e) {
      console.error('Events subscription error', e);
    }

    return () => {
      stateSub?.remove();
      disabledSub?.remove();
      disconnectSub?.remove();
      // Cancel accept on unmount
      BluetoothService.cancelAccept();
      isAccepting.current = false;
    };
  }, [checkBluetoothState, getBonded, startAccepting]);

  // Combine paired + discovered for convenience
  const allDevices = useCallback(() => {
    const map = new Map<string, BluetoothDevice>();
    pairedDevices.forEach(d => map.set(d.address, { ...d, bonded: true }));
    discoveredDevices.forEach(d => {
      if (!map.has(d.address)) {
        map.set(d.address, d);
      }
    });
    return Array.from(map.values());
  }, [pairedDevices, discoveredDevices]);

  return {
    isEnabled,
    isDiscovering,
    devices: allDevices(),
    pairedDevices,
    discoveredDevices,
    connectionState,
    connectedDevice,
    checkBluetoothState,
    scanDevices,
    connect,
    disconnect,
    getBonded,
    startAccepting,
  };
};
