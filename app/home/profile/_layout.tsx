import { Switch } from '@/components/Switch';
import { ToggleIcon, Toggle } from '@/components/Toggle';
import { GlobalContext } from '@/utils/Provider';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Bitcoin } from "lucide-react-native";
import { useColorScheme } from 'nativewind';
import { useContext, useState } from 'react';
import { Text, View } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};


export default function ProfileLayout() {
  const context = useContext(GlobalContext);
  const contextRole = context?.role
  const { colorScheme, setColorScheme } = useColorScheme();


  const HeaderRight = () => {

    const ToggleDarkMode = () => {

      const [isDark, setIsDark] = useState(false);

      const handleToggle = () => {
        setIsDark((prev) => !prev)
        setColorScheme(colorScheme === "dark" ? "light" : "dark")
      }

      return (
        <View className='pr-3'>
          <Toggle
            pressed={isDark}
            onPressedChange={handleToggle}
            aria-label="Toggle bold"
            className='border border-border'
            size={'sm'}
          >
            {!colorScheme && (<Feather name="sun" size={24} color="white" />)}
            {colorScheme === "light" && (<MaterialIcons name="dark-mode" size={24} color="white" />)}
            {colorScheme === "dark" && (<Feather name="sun" size={24} color="white" />)}

          </Toggle>
        </View>

      )
    }


    return (
      <View className='flex flex-row justify-center'>
        <ToggleDarkMode />
      </View>
    )
  }

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colorScheme == 'dark' ? '#010101' : '#002e2e' },
      headerTintColor: '#fff'
    }}>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Perfil', headerRight: () => <HeaderRight />, }} />
      <Stack.Screen name="createVehicle" options={{ headerShown: true, presentation: 'modal', title: 'Registar vehículo' }} />
      <Stack.Screen name="vehicles" options={{ headerShown: true, presentation: 'modal', title: 'Mis vehículos' }} />
    </Stack>
  );
}