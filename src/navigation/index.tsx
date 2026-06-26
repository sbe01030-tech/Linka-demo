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

import SlidingTabBar    from '../components/common/SlidingTabBar';
import SplashScreen      from '../screens/auth/SplashScreen';
import OnboardingScreen  from '../screens/auth/OnboardingScreen';
import WelcomeScreen    from '../screens/auth/WelcomeScreen';
import LoginScreen       from '../screens/auth/LoginScreen';
import RegisterScreen    from '../screens/auth/RegisterScreen';

import HomeScreen         from '../screens/customer/HomeScreen';
import CommunityScreen    from '../screens/community/CommunityScreen';
import ExploreScreen      from '../screens/customer/ExploreScreen';
import ProfileScreen      from '../screens/customer/ProfileScreen';
import WorkerDetailScreen from '../screens/customer/WorkerDetailScreen';

import WorkerHomeScreen    from '../screens/worker/WorkerHomeScreen';
import WorkerOrdersScreen  from '../screens/worker/WorkerOrdersScreen';
import WorkerProfileScreen from '../screens/worker/WorkerProfileScreen';

import ChatListScreen   from '../screens/chat/ChatListScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import MapScreen        from '../screens/map/MapScreen';

import CreatePostScreen  from '../screens/community/CreatePostScreen';
import PostDetailScreen  from '../screens/community/PostDetailScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import HelpFAQScreen     from '../screens/help/HelpFAQScreen';
import ReviewScreen           from '../screens/customer/ReviewScreen';
import BookingScreen          from '../screens/customer/BookingScreen';
import NotificationsScreen    from '../screens/customer/NotificationsScreen';
import OrdersScreen           from '../screens/customer/OrdersScreen';
import WorkerSearchScreen from '../screens/customer/WorkerSearchScreen';
import TermsScreen          from '../screens/auth/TermsScreen';

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
  const { t } = useLanguageStore();
  const switchRole = useAuthStore((s) => s.switchRole);
  return (
    <Tab.Navigator
      tabBar={(props) => <SlidingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      options={{ tabBarLabel: t.nav.home }} />
      <Tab.Screen name="Map"       component={MapScreen}       options={{ tabBarLabel: t.nav.map }} />
      <Tab.Screen name="ChatList"  component={ChatListScreen}  options={{ tabBarLabel: t.nav.chat }} />
      {/* 데모: 프로필 탭 = 워커 입장으로 즉시 전환 (로그아웃 없이) */}
      <Tab.Screen name="Profile"   component={ProfileScreen}   options={{ tabBarLabel: t.nav.profile }}
        listeners={{ tabPress: (e) => { e.preventDefault(); switchRole('helper'); } }} />
      {/* '탐색'(Explore)·'Community' 탭은 숨김 — 화면/라우트/타입은 보존, 필요 시 한 줄로 부활 가능 */}
    </Tab.Navigator>
  );
}

function WorkerTabs() {
  const { t } = useLanguageStore();
  const switchRole = useAuthStore((s) => s.switchRole);
  return (
    <Tab.Navigator
      tabBar={(props) => <SlidingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="WorkerHome"    component={WorkerHomeScreen}    options={{ tabBarLabel: t.nav.dashboard }} />
      <Tab.Screen name="WorkerOrders"  component={WorkerOrdersScreen}  options={{ tabBarLabel: t.nav.jobs }} />
      <Tab.Screen name="WorkerMap"     component={MapScreen}           options={{ tabBarLabel: t.nav.map }} />
      <Tab.Screen name="WorkerChat"    component={ChatListScreen}      options={{ tabBarLabel: t.nav.chat }} />
      {/* 데모: 프로필 탭 = 고객 입장으로 즉시 전환 */}
      <Tab.Screen name="WorkerProfile" component={WorkerProfileScreen} options={{ tabBarLabel: t.nav.profile }}
        listeners={{ tabPress: (e) => { e.preventDefault(); switchRole('customer'); } }} />
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
            <Stack.Screen name="Welcome"    component={WelcomeScreen}   options={{ animation: 'fade' }} />
            <Stack.Screen name="Login"      component={LoginScreen} />
            <Stack.Screen name="Register"   component={RegisterScreen} />
            <Stack.Screen name="Terms"      component={TermsScreen}    options={{ animation: 'slide_from_right' }} />
          </>
        ) : (user?.role === 'helper') ? (
          <>
            <Stack.Screen name="WorkerTabs"   component={WorkerTabs} />
            <Stack.Screen name="ChatDetail"   component={ChatDetailScreen}  options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="EditProfile"  component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="HelpFAQ"      component={HelpFAQScreen}     options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="CreatePost"   component={CreatePostScreen}  options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="PostDetail"   component={PostDetailScreen}  options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Terms"        component={TermsScreen}       options={{ animation: 'slide_from_right' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="CustomerTabs"  component={CustomerTabs} />
            <Stack.Screen name="WorkerSearch"  component={WorkerSearchScreen}  options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="WorkerDetail"  component={WorkerDetailScreen}  options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Booking"       component={BookingScreen}       options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Orders"        component={OrdersScreen}        options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="ChatDetail"   component={ChatDetailScreen}   options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="EditProfile"  component={EditProfileScreen}  options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="HelpFAQ"      component={HelpFAQScreen}      options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Review"       component={ReviewScreen}       options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="CreatePost"   component={CreatePostScreen}   options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="PostDetail"   component={PostDetailScreen}   options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Terms"         component={TermsScreen}         options={{ animation: 'slide_from_right' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
