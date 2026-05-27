import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePermissions } from '../hooks/usePermissions';
import { useAppTheme } from '../hooks/useAppTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { requestPermissions } = usePermissions();
  const { colors } = useAppTheme();
  const scale = useSharedValue(0.86);
  const opacity = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 520 });
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);

    const initApp = async () => {
      try {
        await requestPermissions();
      } catch (e) {
        console.error('Permission request failed', e);
      } finally {
        setTimeout(() => {
          navigation.replace('Welcome');
        }, 1500);
      }
    };

    initApp();
  }, [navigation, opacity, pulse, requestPermissions, scale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.22 + pulse.value * 0.18,
    transform: [{ scale: 1 + pulse.value * 0.2 }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.ring, { backgroundColor: colors.primarySoft }, ringStyle]} />
      <Animated.View style={[styles.logoWrap, { backgroundColor: colors.primary }, logoStyle]}>
        <Icon name="forum" size={54} color="#FFFFFF" />
      </Animated.View>
      <Text style={[styles.title, { color: colors.text }]}>Offline Chat</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Private peer-to-peer messaging
      </Text>
      <View style={styles.loadingRow}>
        <View style={[styles.loadingBar, { backgroundColor: colors.primary }]} />
        <View style={[styles.loadingBar, { backgroundColor: colors.primarySoft }]} />
        <View style={[styles.loadingBar, { backgroundColor: colors.accent }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  ring: {
    borderRadius: 84,
    height: 168,
    position: 'absolute',
    width: 168,
  },
  logoWrap: {
    alignItems: 'center',
    borderRadius: 32,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingRow: {
    bottom: 56,
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
  },
  loadingBar: {
    borderRadius: 5,
    height: 5,
    width: 34,
  },
});

export default SplashScreen;
