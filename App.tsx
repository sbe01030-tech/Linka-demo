import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import {
  NotoSerifKR_400Regular,
  NotoSerifKR_600SemiBold,
  NotoSerifKR_700Bold,
} from '@expo-google-fonts/noto-serif-kr';
import {
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';
import { useEffect } from 'react';
import Navigation from './src/navigation';
import { fetchState } from './src/store/sync';
import { useChatStore } from './src/store/chatStore';
import { useBookingStore } from './src/store/bookingStore';

export default function App() {
  // 데모 동기화: 로컬 서버(sync-server.js)를 1.5초마다 폴링 →
  // 다른 시뮬레이터가 보낸 메시지/예약을 스토어에 병합. 서버 없으면 조용히 무시.
  useEffect(() => {
    const id = setInterval(async () => {
      const remote = await fetchState();
      if (!remote) return;
      useChatStore.getState().mergeRemote(remote);
      useBookingStore.getState().mergeRemote(remote.bookings ?? []);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    NotoSerifKR_400Regular,
    NotoSerifKR_600SemiBold,
    NotoSerifKR_700Bold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  // Keep native splash visible until fonts are ready
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Navigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
