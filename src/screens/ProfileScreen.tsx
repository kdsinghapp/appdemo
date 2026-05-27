import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { Avatar } from '../components/Avatar';
import { useAppTheme } from '../hooks/useAppTheme';
import { useBluetooth } from '../hooks/useBluetooth';
import { StatusPill } from '../components/StatusPill';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const { isEnabled, connectedDevice } = useBluetooth();

  return (
    <Screen>
      <Header title="Profile" onBack={() => navigation.goBack()} avatarIcon="person-outline" />
      <View style={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Avatar name="Offline User" online={Boolean(connectedDevice)} size={104} />
          <Text style={[styles.name, { color: colors.text }]}>Offline User</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Available for nearby chats</Text>
          <StatusPill
            label={connectedDevice ? 'Connected' : isEnabled ? 'Discoverable' : 'Bluetooth Off'}
            tone={connectedDevice || isEnabled ? 'success' : 'error'}
            icon="bluetooth"
          />
        </View>

        <View style={styles.infoList}>
          {[
            ['Device Name', connectedDevice?.name || 'This device', 'smartphone'],
            ['Connection Mode', 'Bluetooth peer-to-peer', 'settings-input-antenna'],
            ['Privacy', 'Messages stay on your device', 'lock'],
          ].map(([label, value, icon]) => (
            <View key={label} style={[styles.infoRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.primarySoft }]}>
                <Icon name={icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 3,
    padding: 28,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 6,
  },
  infoList: {
    gap: 10,
    marginTop: 16,
  },
  infoRow: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  infoIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
});

export default ProfileScreen;
