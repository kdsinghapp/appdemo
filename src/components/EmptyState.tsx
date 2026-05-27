import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/useAppTheme';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.illustration, { backgroundColor: colors.primarySoft }]}>
        <View style={[styles.spark, styles.sparkOne, { backgroundColor: colors.accentSoft }]} />
        <View style={[styles.spark, styles.sparkTwo, { backgroundColor: colors.surface }]} />
        <Icon name={icon} size={54} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  illustration: {
    alignItems: 'center',
    borderRadius: 44,
    height: 128,
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    width: 128,
  },
  spark: {
    position: 'absolute',
  },
  sparkOne: {
    borderRadius: 28,
    height: 56,
    right: -10,
    top: 14,
    width: 56,
  },
  sparkTwo: {
    borderRadius: 18,
    bottom: 18,
    height: 36,
    left: 14,
    opacity: 0.75,
    width: 36,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 310,
    textAlign: 'center',
  },
});
