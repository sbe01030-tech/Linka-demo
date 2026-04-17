import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { Colors } from '../constants/colors';

import SplashScreen      from '../screens/auth/SplashScreen';
import OnboardingScreen  from '../screens/auth/OnboardingScreen';
import LoginScreen       from '../screens/auth/LoginScreen';
import RegisterScreen    from '../screens/auth/RegisterScreen';

import HomeScreen         from '../screens/customer/HomeScreen';
import CommunityScreen    from '../screens/community/CommunityScreen';
import ProfileScreen      from '../screens/customer/ProfileScreen';
import WorkerDetailScreen from '../screens/customer/WorkerDetailScreen';

import WorkerHomeScreen    from '../screens/worker/WorkerHomeScreen';
import WorkerOrdersScreen  from '../screens/worker/WorkerOrdersScreen';
import WorkerProfileScreen from '../screens/worker/WorkerProfileScreen';

import ChatListScreen   from '../screens/chat/ChatListScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import MapScreen        from '../screens/map/MapScreen';

import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

function TabIcon({ focused, name }: { focused: boolean; name: any }) {
  return (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={22}
      color={focused ? Colors.accent : Colors.grayLight}
    />
  );
}

function CustomerTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const tabH = 64 + insets.bottom;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.border,
          borderTopWidth:  1,
          height:          tabH,
          paddingBottom:   insets.bottom + 12,
          paddingTop:      8,
        },
        tabBarActiveTintColor:   Colors.accent,
        tabBarInactiveTintColor: Colors.grayLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 0 },
        tabBarIcon: ({ focused }) => {
          const icons: Record<string, string> = {
            Home:      'home',
            Community: 'chatbubbles',
            Map:       'map',
            ChatList:  'chatbubble-ellipses',
            Profile:   'person',
          };
          if (route.name === 'Map') {
            return (
              <View style={{
                width: 46, height: 46, borderRadius: 23,
                backgroundColor: focused ? Colors.accent : Colors.section,
                alignItems: 'center', justifyContent: 'center',
                marginTop: -18,
                borderWidth: 3, borderColor: Colors.white,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15, shadowRadius: 4, elevation: 6,
              }}>
                <Ionicons name={focused ? 'search' : 'search-outline'} size={22}
                  color={focused ? Colors.white : Colors.grayLight} />
              </View>
            );
          }
          return <TabIcon focused={focused} name={icons[route.name] ?? 'ellipse'} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      options={{ tabBarLabel: t.nav.home }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ tabBarLabel: t.community.title }} />
      <Tab.Screen name="Map"       component={MapScreen}       options={{ tabBarLabel: t.nav.map }} />
      <Tab.Screen name="ChatList"  component={ChatListScreen}  options={{ tabBarLabel: t.nav.chat }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}   options={{ tabBarLabel: t.nav.profile }} />
    </Tab.Navigator>
  );
}

function WorkerTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguageStore();
  const tabH = 64 + insets.bottom;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor:  Colors.border,
          borderTopWidth:  1,
          height:          tabH,
          paddingBottom:   insets.bottom + 12,
          paddingTop:      8,
        },
        tabBarActiveTintColor:   Colors.accent,
        tabBarInactiveTintColor: Colors.grayLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 0 },
        tabBarIcon: ({ focused }) => {
          const icons: Record<string, string> = {
            WorkerHome:    'grid',
            WorkerOrders:  'briefcase',
            WorkerMap:     'map',
            WorkerChat:    'chatbubble-ellipses',
            WorkerProfile: 'person',
          };
          if (route.name === 'WorkerMap') {
            return (
              <View style={{
                width: 46, height: 46, borderRadius: 23,
                backgroundColor: focused ? Colors.accent : Colors.section,
                alignItems: 'center', justifyContent: 'center',
                marginTop: -18,
                borderWidth: 3, borderColor: Colors.white,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15, shadowRadius: 4, elevation: 6,
              }}>
                <Ionicons name={focused ? 'search' : 'search-outline'} size={22}
                  color={focused ? Colors.white : Colors.grayLight} />
              </View>
            );
          }
          return <TabIcon focused={focused} name={icons[route.name] ?? 'ellipse'} />;
        },
      })}
    >
      <Tab.Screen name="WorkerHome"    component={WorkerHomeScreen}   options={{ tabBarLabel: t.nav.dashboard }} />
      <Tab.Screen name="WorkerOrders"  component={WorkerOrdersScreen} options={{ tabBarLabel: t.nav.jobs }} />
      <Tab.Screen name="WorkerMap"     component={MapScreen}          options={{ tabBarLabel: t.nav.map }} />
      <Tab.Screen name="WorkerChat"    component={ChatListScreen}     options={{ tabBarLabel: t.nav.chat }} />
      <Tab.Screen name="WorkerProfile" component={WorkerProfileScreen} options={{ tabBarLabel: t.nav.profile }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Splash"     component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login"      component={LoginScreen} />
            <Stack.Screen name="Register"   component={RegisterScreen} />
          </>
        ) : (user?.role === 'helper' || user?.role === 'tutor') ? (
          <>
            <Stack.Screen name="WorkerTabs"  component={WorkerTabs} />
            <Stack.Screen name="ChatDetail"  component={ChatDetailScreen} options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
            <Stack.Screen name="WorkerDetail" component={WorkerDetailScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="ChatDetail"   component={ChatDetailScreen}   options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
