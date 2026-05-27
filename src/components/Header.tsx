import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/useAppTheme';
import { AnimatedPressable } from './AnimatedPressable';
import { Avatar } from './Avatar';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  secondRightIcon?: string;
  onSecondRightPress?: () => void;
  avatarName?: string | null;
  avatarIcon?: string;
  online?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  secondRightIcon,
  onSecondRightPress,
  avatarName,
  avatarIcon,
  online,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.leftContainer}>
        {onBack && (
          <AnimatedPressable style={styles.iconButton} onPress={onBack} accessibilityRole="button">
            <Icon name="arrow-back" size={23} color={colors.text} />
          </AnimatedPressable>
        )}
        {(avatarName !== undefined || avatarIcon) && (
          <Avatar name={avatarName} icon={avatarIcon} online={online} size={42} />
        )}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        {secondRightIcon && onSecondRightPress && (
          <AnimatedPressable style={styles.iconButton} onPress={onSecondRightPress} accessibilityRole="button">
            <Icon name={secondRightIcon} size={22} color={colors.text} />
          </AnimatedPressable>
        )}
        {rightIcon && onRightPress && (
          <AnimatedPressable style={styles.iconButton} onPress={onRightPress} accessibilityRole="button">
            <Icon name={rightIcon} size={22} color={colors.text} />
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 68,
    paddingHorizontal: 12,
  },
  leftContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 0,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
