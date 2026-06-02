import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const { width: W } = Dimensions.get('window');
const BRAND = Colors.accent;

const CUSTOMER_ICONS: Record<string, string> = {
  Home:      'home',
  Community: 'chatbubbles',
  Map:       'search',
  ChatList:  'chatbubble-ellipses',
  Profile:   'person',
};

const WORKER_ICONS: Record<string, string> = {
  WorkerHome:    'grid',
  WorkerOrders:  'briefcase',
  WorkerMap:     'search',
  WorkerChat:    'chatbubble-ellipses',
  WorkerProfile: 'person',
};

export default function SlidingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets   = useSafeAreaInsets();
  const numTabs  = Math.max(state.routes.length, 1);   // 0 division 방어
  const tabW     = W / numTabs;
  const initialX = Number.isFinite(state.index * tabW) ? state.index * tabW : 0;

  // 슬라이딩 pill x 위치
  const slideX = useRef(new Animated.Value(initialX)).current;

  useEffect(() => {
    const target = Number.isFinite(state.index * tabW) ? state.index * tabW : 0;
    const anim = Animated.spring(slideX, {
      toValue: target,
      useNativeDriver: true,
      speed: 22,
      bounciness: 10,
    });
    anim.start();
    return () => anim.stop();   // 언마운트/리렌더 시 native 노드 깔끔히 정리
  }, [state.index, tabW]);

  const icons = CUSTOMER_ICONS[state.routes[0]?.name] !== undefined
    ? CUSTOMER_ICONS
    : WORKER_ICONS;

  const BAR_H  = 56 + insets.bottom;
  const PILL_W = 44;
  const PILL_H = 4;

  return (
    <View style={[tb.bar, { height: BAR_H, paddingBottom: insets.bottom }]}>

      {/* 슬라이딩 pill 인디케이터 (상단 바) */}
      <Animated.View
        style={[
          tb.pill,
          {
            width: PILL_W,
            height: PILL_H,
            left: tabW / 2 - PILL_W / 2,
            transform: [{ translateX: slideX }],
          },
        ]}
      />

      {/* 탭 버튼들 */}
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused     = state.index === index;
        const iconName    = icons[route.name] ?? 'ellipse';
        const label       = typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress', target: route.key, canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[tb.tab, { width: tabW }]}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={focused ? iconName as any : `${iconName}-outline` as any}
              size={22}
              color={focused ? BRAND : Colors.grayLight}
            />
            <Text style={[tb.label, focused && tb.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tb = StyleSheet.create({
  bar: {
    flexDirection:   'row',
    backgroundColor: Colors.white,
    borderTopWidth:  1,
    borderTopColor:  Colors.border,
    alignItems:      'flex-end',
    position:        'relative',
  },
  pill: {
    position:     'absolute',
    top:          0,
    borderRadius: 2,
    backgroundColor: BRAND,
  },
  tab: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingTop:     10,
    paddingBottom:  8,
    gap:            3,
  },
  label: {
    fontSize:   10,
    fontWeight: '500',
    color:      Colors.grayLight,
  },
  labelActive: {
    color:      BRAND,
    fontWeight: '700',
  },
});
