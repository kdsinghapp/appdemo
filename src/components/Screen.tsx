import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export const Screen: React.FC<ScreenProps> = ({ children, style, edges = ['top', 'left', 'right'] }) => {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor: colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
