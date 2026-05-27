import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePermissions } from '../hooks/usePermissions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const isDark = useColorScheme() === 'dark';
  const { requestPermissions } = usePermissions();

  useEffect(() => {
    const initApp = async () => {
      try {
        // Request permissions
        await requestPermissions();
      } catch (e) {
        console.error("Permission request failed", e);
      } finally {
        // Add slight delay for splash screen visibility
        setTimeout(() => {
          navigation.replace('Home');
        }, 1500);
      }
    };

    initApp();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.primary }]}>
      <Icon name="bluetooth-connected" size={100} color="#FFF" />
      <Text style={styles.title}>Offline Chat</Text>
      <Text style={styles.subtitle}>Peer-to-Peer Messaging</Text>
      
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 50,
  },
});

export default SplashScreen;
