import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Screen } from '../components/Screen';
import { useAppTheme } from '../hooks/useAppTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useAppTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={[styles.hero, { backgroundColor: colors.primarySoft }]}>
          <View style={[styles.phone, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}>
            <View style={[styles.bubble, styles.leftBubble, { backgroundColor: colors.input }]} />
            <View style={[styles.bubble, styles.rightBubble, { backgroundColor: colors.primary }]} />
            <View style={[styles.bubble, styles.leftBubbleSmall, { backgroundColor: colors.input }]} />
          </View>
          <View style={[styles.signal, { backgroundColor: colors.accentSoft }]}>
            <Icon name="wifi-tethering" size={28} color={colors.accent} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Chat nearby, even offline.</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Connect over Bluetooth and keep conversations simple, private, and available anywhere.
        </Text>

        <View style={styles.features}>
          {[
            ['bluetooth-connected', 'Fast local connections'],
            ['lock', 'Private device-to-device chat'],
            ['dark-mode', 'Light and dark themes'],
          ].map(([icon, label]) => (
            <View key={label} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: colors.primarySoft }]}>
                <Icon name={icon} size={18} color={colors.primary} />
              </View>
              <Text style={[styles.featureText, { color: colors.text }]}>{label}</Text>
            </View>
          ))}
        </View>

        <AnimatedPressable
          style={[styles.primaryButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={() => navigation.replace('Home')}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Start Messaging</Text>
          <Icon name="arrow-forward" size={21} color="#FFFFFF" />
        </AnimatedPressable>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 42,
    height: 240,
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  phone: {
    borderRadius: 30,
    elevation: 8,
    height: 172,
    padding: 18,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    width: 132,
  },
  bubble: {
    borderRadius: 14,
    height: 28,
    marginBottom: 12,
  },
  leftBubble: {
    alignSelf: 'flex-start',
    width: 78,
  },
  rightBubble: {
    alignSelf: 'flex-end',
    width: 70,
  },
  leftBubbleSmall: {
    alignSelf: 'flex-start',
    width: 54,
  },
  signal: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 42,
    top: 42,
    width: 56,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 40,
  },
  body: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 12,
  },
  features: {
    gap: 14,
  },
  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  featureIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 18,
    elevation: 4,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 17,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

export default WelcomeScreen;
