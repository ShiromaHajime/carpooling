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
  initialRouteName: '(profile)',
};


export default function ProfileLayout() {
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
      <View className='flex flex-row justify-center items-center gap-3'>
        <Text className='text-lg text-white'>Rol: {textRole}</Text>
        <Switch onCheckedChange={handleChangeRol} checked={role == 'Driver' ? true : false} />
      </View>
    )
  }




  const HeaderRight = () => {
    const { colorScheme, setColorScheme } = useColorScheme();

    const ToggleDarkMode = () => {

      const [isDark, setIsDark] = useState(false);

      const handleToggle = () => {
        setIsDark((prev) => !prev)
        setColorScheme(colorScheme === "dark" ? "light" : "dark")
      }

      return (
        <View>
          <Toggle
            pressed={isDark}
            onPressedChange={handleToggle}
            aria-label="Toggle bold"
            className='border border-border'
            size={'sm'}
          >
            {colorScheme === "light" && (<MaterialIcons name="dark-mode" size={24} color="white" />)}
            {colorScheme === "dark" && (<Feather name="sun" size={24} color="white" />)}

          </Toggle>
        </View>
      )
    }


    return (
      <View className='flex flex-row gap-4 justify-end items-center'>
        <ToggleDarkMode />
        <CurrentRole />
      </View>
    )
  }

  const { colorScheme } = useColorScheme()

  return (
    <Stack>
      <Stack.Screen name="profile" options={{
        headerShown: true,
        title: 'Perfil',
        headerRight: () => (<HeaderRight />),
        headerStyle: { backgroundColor: colorScheme == 'dark' ? '#010101' : '#002e2e' },
        headerTitleStyle: { color: "#fff" }
      }} />
      <Stack.Screen name="createVehicle" options={{ headerShown: true, presentation: 'modal', title: 'Registar vehículo' }} />
      <Stack.Screen name="vehicles" options={{ headerShown: true, presentation: 'modal', title: 'Mis vehículos' }} />
    </Stack>
  );
}