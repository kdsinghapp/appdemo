import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/useAppTheme';

interface AvatarProps {
  name?: string | null;
  icon?: string;
  size?: number;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  icon = 'person',
  size = 48,
  online,
}) => {
  const { colors } = useAppTheme();
  const initials = (name || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primarySoft,
          },
        ]}
      >
        {initials ? (
          <Text style={[styles.initials, { color: colors.primary, fontSize: size * 0.34 }]}>
            {initials}
          </Text>
        ) : (
          <Icon name={icon} size={size * 0.48} color={colors.primary} />
        )}
      </View>
      {online !== undefined && (
        <View
          style={[
            styles.status,
            {
              width: size * 0.24,
              height: size * 0.24,
              borderRadius: size * 0.12,
              backgroundColor: online ? colors.online : colors.textMuted,
              borderColor: colors.surface,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '800',
  },
  status: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
  },
});
