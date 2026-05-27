import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../components/Header';
import { Screen } from '../components/Screen';
import { useAppTheme } from '../hooks/useAppTheme';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useAppTheme();
  const [readReceipts, setReadReceipts] = useState(true);
  const [typingStatus, setTypingStatus] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);

  return (
    <Screen>
      <Header title="Settings" onBack={() => navigation.goBack()} avatarIcon="settings" />
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Messaging</Text>
        <View style={styles.section}>
          <SettingSwitch
            icon="done-all"
            title="Read receipts"
            subtitle="Show sent and seen indicators in chats"
            value={readReceipts}
            onValueChange={setReadReceipts}
            colors={colors}
          />
          <SettingSwitch
            icon="more-horiz"
            title="Typing indicator"
            subtitle="Show a smooth typing animation while connecting"
            value={typingStatus}
            onValueChange={setTypingStatus}
            colors={colors}
          />
          <SettingSwitch
            icon="sync"
            title="Auto reconnect"
            subtitle="Try to restore chat connections automatically"
            value={autoReconnect}
            onValueChange={setAutoReconnect}
            colors={colors}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={[styles.themeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
            <Icon name={isDark ? 'dark-mode' : 'light-mode'} size={21} color={colors.primary} />
          </View>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>System theme</Text>
            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
              The app follows your Android light or dark mode setting.
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

interface SettingSwitchProps {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

const SettingSwitch: React.FC<SettingSwitchProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  colors,
}) => (
  <View style={[styles.settingRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
      <Icon name={icon} size={21} color={colors.primary} />
    </View>
    <View style={styles.settingText}>
      <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor="#FFFFFF"
      trackColor={{ false: colors.input, true: colors.primary }}
    />
  </View>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
    marginTop: 10,
  },
  section: {
    gap: 10,
  },
  settingRow: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  themeCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 3,
  },
});

export default SettingsScreen;
