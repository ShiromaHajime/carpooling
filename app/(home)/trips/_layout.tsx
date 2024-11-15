import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect } from 'react';
import { TripContext, TripProvider } from './TripProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(home)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function TripsLayout() {
  const { colorScheme } = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      // Función que se ejecuta cuando la tab gana foco
      console.log('Tab Viajes ganada');
      // router.replace("/trips/tripList") HACE RE RENDER INFINITOOO 🔥🔥
      // Función de limpieza cuando la tab pierde el foco
      return () => {
        console.log('Tab Viajes perdida');
      };
    }, [])
  );

  return (
    <TripProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme == 'dark' ? '#010101' : '#002e2e'
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="detail/[id]" options={{
          headerShown: true, title: "Detalle viaje",
        }} />
        <Stack.Screen name="tripList" options={{
          headerShown: true, title: "Viajes",
        }} />
        <Stack.Screen name="createTrip" options={{ headerShown: false, title: "Crear viaje", }} />
        <Stack.Screen name="detail/chat" options={{
          headerShown: true, title: "Chat"
        }} />
      </Stack>
    </TripProvider>
  );
}