import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BluetoothDevice } from '../types/bluetooth';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import NearbyDevicesScreen from '../screens/NearbyDevicesScreen';
import ChatScreen from '../screens/ChatScreen';
import ConnectionStatusScreen from '../screens/ConnectionStatusScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  NearbyDevices: undefined;
  Chat: { device: BluetoothDevice };
  ConnectionStatus: { device: BluetoothDevice };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NearbyDevices" component={NearbyDevicesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ConnectionStatus" component={ConnectionStatusScreen} />
    </Stack.Navigator>
  );
};
