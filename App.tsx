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
import Navigation from './src/navigation';

export default function App() {
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
