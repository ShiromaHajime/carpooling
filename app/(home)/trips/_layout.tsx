import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

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

  console.log('render TripsLayout');

  return (

    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#014e41',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="detail/[id]" options={{ headerShown: true, title: "Detalle viaje", }} />
      <Stack.Screen name="tripList" options={{ headerShown: true, title: "Viajes", }} />
      <Stack.Screen name="createTrip" options={{ headerShown: true, title: "Crear viaje", }} />
      <Stack.Screen name="chat" options={{ headerShown: true, title: "Chat", }} />
    </Stack>
  );
}