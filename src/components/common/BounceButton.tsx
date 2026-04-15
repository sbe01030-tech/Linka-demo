import React, { useRef } from 'react';
import {
  Animated, TouchableWithoutFeedback, StyleSheet, ViewStyle,
} from 'react-native';

interface Props {
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  disabled?: boolean;
  scale?: number;
}

/**
 * Bouncy spring-animated pressable — gives every button a playful feel.
 */
export default function BounceButton({
  onPress, style, children, disabled, scale = 0.92,
}: Props) {
  const anim = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(anim, {
      toValue: scale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();

  const pressOut = () =>
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: anim }] }]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
