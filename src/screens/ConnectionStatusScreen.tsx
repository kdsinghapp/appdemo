import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { useBluetooth } from '../hooks/useBluetooth';
import { Colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

type StatusRouteProp = RouteProp<RootStackParamList, 'ConnectionStatus'>;

const ConnectionStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<StatusRouteProp>();
  const { device } = route.params;
  const isDark = useColorScheme() === 'dark';
  
  const { connectedDevice, connectionState, connect, disconnect } = useBluetooth();
  const [loading, setLoading] = useState(false);

  const isConnected = connectedDevice?.address === device.address;

  const handleConnect = async () => {
    setLoading(true);
    await connect(device as any);
    setLoading(false);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      <Header 
        title="Device Info" 
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: isDark ? Colors.cardDark : Colors.card }]}>
          <View style={styles.iconContainer}>
            <Icon 
              name={isConnected ? "bluetooth-connected" : "bluetooth"} 
              size={64} 
              color={isConnected ? Colors.primary : Colors.textMuted} 
            />
          </View>
          
          <Text style={[styles.name, { color: isDark ? Colors.textDark : Colors.text }]}>
            {device.name || 'Unknown Device'}
          </Text>
          <Text style={styles.address}>{device.address}</Text>

          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: isConnected ? Colors.success : Colors.error }]} />
            <Text style={[styles.statusText, { color: isConnected ? Colors.success : Colors.error }]}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          {isConnected ? (
            <TouchableOpacity 
              style={[styles.button, styles.disconnectBtn]} 
              onPress={handleDisconnect}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.connectBtn]} 
              onPress={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Connect</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectBtn: {
    backgroundColor: Colors.primary,
  },
  disconnectBtn: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConnectionStatusScreen;
