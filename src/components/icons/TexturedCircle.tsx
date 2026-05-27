/**
 * 텍스처가 입혀진 원형 배경.
 * 노골적인 streak 대신 좌상단에서 빛이 떨어지는 듯한 소프트 그라데이션 +
 * 거의 안 보일 정도의 미세 brush hint 하나로 표현. 세련되고 절제된 룩.
 *
 * 사용:
 *   <TexturedCircle size={48} color="#FFE899" style={...} />
 */
import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Rect,
  Defs,
  ClipPath,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

interface Props {
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export const TexturedCircle = ({ size, color, style }: Props) => (
  <View style={[{ width: size, height: size }, style]}>
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        {/* 둥근 사각형 클립 — 원래는 원형이었지만 카드 룩으로 변경됨 */}
        <ClipPath id="clip">
          <Rect x="0" y="0" width="100" height="100" rx="26" ry="26" />
        </ClipPath>
        {/* 좌상단에서 떨어지는 부드러운 빛 */}
        <RadialGradient id="light" cx="30%" cy="25%" r="85%">
          <Stop offset="0"    stopColor="#FFFFFF" stopOpacity="0.38" />
          <Stop offset="0.4"  stopColor="#FFFFFF" stopOpacity="0.10" />
          <Stop offset="1"    stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      <G clipPath="url(#clip)">
        {/* Base color — 둥근 사각형 */}
        <Rect x="0" y="0" width="100" height="100" rx="26" ry="26" fill={color} />

        {/* 소프트 라이팅 — 한쪽에서 비치는 빛 */}
        <Rect x="0" y="0" width="100" height="100" fill="url(#light)" />

        {/* 아주 옅은 brush hint 하나 — 결만 살짝 */}
        <Ellipse cx="36" cy="30" rx="44" ry="2.2"
                 fill="#FFFFFF" opacity="0.14"
                 transform="rotate(-30 36 30)" />
      </G>
    </Svg>
  </View>
);
