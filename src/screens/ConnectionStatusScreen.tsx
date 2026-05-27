import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Header } from '../components/Header';
import { useBluetooth } from '../hooks/useBluetooth';
import { Screen } from '../components/Screen';
import { useAppTheme } from '../hooks/useAppTheme';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Avatar } from '../components/Avatar';
import { StatusPill } from '../components/StatusPill';

type StatusRouteProp = RouteProp<RootStackParamList, 'ConnectionStatus'>;

const ConnectionStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<StatusRouteProp>();
  const { device } = route.params;
  const { colors } = useAppTheme();
  const { connectedDevice, connect, disconnect } = useBluetooth();
  const [loading, setLoading] = useState(false);
  const pulse = useSharedValue(0);
  const isConnected = connectedDevice?.address === device.address;

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: isConnected ? 0.08 + pulse.value * 0.16 : 0,
    transform: [{ scale: 1 + pulse.value * 0.18 }],
  }));

  const handleConnect = async () => {
    setLoading(true);
    await connect(device);
    setLoading(false);
  };

  return (
    <Screen>
      <Header title="Connection" onBack={() => navigation.goBack()} avatarIcon="settings-input-antenna" />

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Animated.View style={[styles.pulse, { backgroundColor: colors.primary }, pulseStyle]} />
          <Avatar name={device.name} icon="devices" online={isConnected} size={96} />
          <Text style={[styles.deviceName, { color: colors.text }]}>{device.name || 'Unknown Device'}</Text>
          <Text style={[styles.deviceAddress, { color: colors.textMuted }]}>{device.address}</Text>
          <StatusPill
            label={isConnected ? 'Connected' : loading ? 'Reconnecting' : 'Disconnected'}
            tone={isConnected ? 'success' : loading ? 'warning' : 'error'}
            icon={isConnected ? 'link' : loading ? 'sync' : 'link-off'}
          />
        </View>

        <View style={styles.metrics}>
          {[
            ['Signal', isConnected ? 'Strong' : 'Unavailable', 'network-wifi'],
            ['Transport', 'Bluetooth', 'bluetooth'],
            ['Security', 'Local only', 'verified-user'],
          ].map(([label, value, icon]) => (
            <View key={label} style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name={icon} size={22} color={colors.primary} />
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
            </View>
          ))}
        </View>

        <AnimatedPressable
          style={[
            styles.primaryButton,
            { backgroundColor: isConnected ? colors.error : colors.primary, shadowColor: isConnected ? colors.error : colors.primary },
          ]}
          onPress={isConnected ? disconnect : handleConnect}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name={isConnected ? 'link-off' : 'bluetooth-connected'} size={21} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>{isConnected ? 'Disconnect' : 'Reconnect'}</Text>
            </>
          )}
        </AnimatedPressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  heroCard: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 3,
    overflow: 'hidden',
    padding: 28,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  pulse: {
    borderRadius: 120,
    height: 240,
    position: 'absolute',
    top: 12,
    width: 240,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 18,
    textAlign: 'center',
  },
  deviceAddress: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 6,
  },
  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  metricCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '900',
    marginTop: 3,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    elevation: 4,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 17,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default ConnectionStatusScreen;
