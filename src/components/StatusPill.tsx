import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/useAppTheme';

interface StatusPillProps {
  label: string;
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  icon?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ label, tone = 'neutral', icon }) => {
  const { colors } = useAppTheme();
  const toneColor = tone === 'success'
    ? colors.success
    : tone === 'warning'
      ? colors.warning
      : tone === 'error'
        ? colors.error
        : colors.textMuted;

  return (
    <View style={[styles.container, { backgroundColor: `${toneColor}18` }]}>
      {icon && <Icon name={icon} size={14} color={toneColor} />}
      <Text style={[styles.label, { color: toneColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
