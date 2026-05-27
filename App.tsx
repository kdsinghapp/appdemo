import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { Colors } from './src/utils/colors';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const MyTheme = {
    ...DefaultTheme,
    dark: isDarkMode,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.primary,
      background: isDarkMode ? Colors.backgroundDark : Colors.background,
      card: isDarkMode ? Colors.cardDark : Colors.card,
      text: isDarkMode ? Colors.textDark : Colors.text,
      border: isDarkMode ? Colors.borderDark : Colors.border,
      notification: Colors.primary,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'light-content'}
        backgroundColor={isDarkMode ? Colors.cardDark : Colors.primary}
      />
      <NavigationContainer theme={MyTheme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
