import { Switch } from '@/components/Switch';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { GlobalContext } from '@/utils/Provider';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, Tabs, router, useFocusEffect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, Text, View, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function HomeLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const HeaderHome = () => {

    const context = useContext(GlobalContext);
    const contextRole = context?.role

    const CurrentRole = () => {
      const [role, setRole] = useState(contextRole);

      let textRole
      if (contextRole) {
        textRole = role == 'Passenger' ? 'Pasajero' : 'Conductor'
      }
      const handleChangeRol = () => {
        const newRole = role == 'Driver' ? 'Passenger' : 'Driver'
        setRole(newRole)
        context?.setRole(newRole)
      }

      return (
        <View className='flex flex-row justify-center items-center gap-3 pr-4'>
          <Text className='text-lg text-white'>Rol: {textRole}</Text>
          <Switch onCheckedChange={handleChangeRol} checked={role == 'Driver' ? true : false} />
        </View>
      )
    }


    return (
      <View className='flex flex-row gap-4 justify-end items-center'>
        <CurrentRole />
      </View>
    )
  }

  const IconTabProfile = () => {
    const [isFocused, setIsFocused] = useState(false);

    useFocusEffect(
      useCallback(() => {
        setIsFocused(true);

        return () => setIsFocused(false);
      }, [])
    );

    return (
      <Pressable
        onPress={() => {
          router.navigate({ pathname: "/(home)/(profile)", params: { idDriver: undefined } });
        }}
        className='flex-1 justify-center items-center mt-2'
      >
        <FontAwesome6 name="user-circle" size={24} color={isFocused ? '#007aff' : 'gray'} />
        <Text className='text-muted text-xs mt-1'>Perfil</Text>
      </Pressable>
    );
  };
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerRight: () => (<HeaderHome />),
          title: 'Carpooling',
          headerStyle: { backgroundColor: colorScheme == 'dark' ? '#010101' : '#002e2e' },
          headerTitleStyle: { color: "#fff" },
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Viajes',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="car-sports" size={38} color={focused ? '#007aff' : ''} />
          ),
          unmountOnBlur: true, // Vacía el stack cuando se cambia de pestaña
        }}
      />
      <Tabs.Screen
        name="(profile)"
        initialParams={{}}
        options={{
          title: 'Perfil',
          tabBarButton: () => <IconTabProfile />,
          unmountOnBlur: true, // Vacía el stack cuando se cambia de pestaña
        }}
      />
    </Tabs>

  );
}