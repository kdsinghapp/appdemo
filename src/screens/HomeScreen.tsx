import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
import { useAppTheme } from '../hooks/useAppTheme';
import { Screen } from '../components/Screen';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { StatusPill } from '../components/StatusPill';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppTheme();
  const { isEnabled, connectedDevice, disconnect } = useBluetooth();
  const [recentDevices, setRecentDevices] = useState<BluetoothDevice[]>([]);
  const [query, setQuery] = useState('');
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

  const filteredDevices = recentDevices.filter(device =>
    `${device.name || ''} ${device.address}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Screen>
      <Header
        title="Chats"
        subtitle="Offline messaging"
        avatarIcon="forum"
        rightIcon="settings"
        onRightPress={() => navigation.navigate('Settings')}
        secondRightIcon="person-outline"
        onSecondRightPress={() => navigation.navigate('Profile')}
      />

      <FlatList
        data={filteredDevices}
        keyExtractor={(item) => item.address}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          filteredDevices.length === 0 && styles.emptyContent,
        ]}
        ListHeaderComponent={
          <View>
            <View style={[styles.connectionCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <View style={styles.connectionTop}>
                <View>
                  <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Connection</Text>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {connectedDevice ? connectedDevice.name || 'Connected Device' : 'Ready to connect'}
                  </Text>
                </View>
                <StatusPill
                  label={connectedDevice ? 'Online' : isEnabled ? 'Bluetooth On' : 'Bluetooth Off'}
                  tone={connectedDevice || isEnabled ? 'success' : 'error'}
                  icon={connectedDevice ? 'wifi-tethering' : 'bluetooth'}
                />
              </View>
              <View style={styles.connectionActions}>
                <AnimatedPressable
                  style={[styles.actionButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('NearbyDevices')}
                  accessibilityRole="button"
                >
                  <Icon name="bluetooth-searching" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Find Devices</Text>
                </AnimatedPressable>
                {connectedDevice && (
                  <AnimatedPressable
                    style={[styles.secondaryButton, { backgroundColor: colors.input }]}
                    onPress={disconnect}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.error }]}>Disconnect</Text>
                  </AnimatedPressable>
                )}
              </View>
            </View>

            <View style={[styles.searchWrap, { backgroundColor: colors.input }]}>
              <Icon name="search" size={21} color={colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search chats or devices"
                placeholderTextColor={colors.textMuted}
                style={[styles.searchInput, { color: colors.text }]}
                selectionColor={colors.primary}
              />
            </View>

            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Chats</Text>
              <Text style={[styles.sectionCount, { color: colors.textMuted }]}>{filteredDevices.length}</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <DeviceCard
            device={{
              ...item,
              connected: connectedDevice?.address === item.address,
            }}
            caption="Tap to open conversation"
            onPress={(device) => navigation.navigate('Chat', { device })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="chat-bubble-outline"
            title={query ? 'No matching chats' : 'No chats yet'}
            message={query ? 'Try a different device name or address.' : 'Find a nearby paired device and your conversations will appear here.'}
          />
        }
      />

      <AnimatedPressable
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => navigation.navigate('NearbyDevices')}
        accessibilityRole="button"
      >
        <Icon name="edit" size={24} color="#FFFFFF" />
      </AnimatedPressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 104,
  },
  emptyContent: {
    flexGrow: 1,
  },
  connectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  connectionTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  connectionActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 13,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '900',
  },
  searchWrap: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    minHeight: 50,
  },
  sectionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: '800',
  },
  fab: {
    alignItems: 'center',
    borderRadius: 30,
    bottom: 24,
    elevation: 5,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    width: 60,
  },
});

export default HomeScreen;
