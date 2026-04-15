import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IoniconName;
  size?: number;
  color?: string;
}

/**
 * Consistent icon wrapper using Ionicons outline-style icons.
 * All icons use the outline variant for a clean 2px visual stroke weight.
 */
export default function Icon({ name, size = 20, color = Colors.primary }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
