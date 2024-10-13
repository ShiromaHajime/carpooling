import { Switch } from '@/components/Switch';
import { GlobalContext } from '@/utils/Provider';
import { Stack } from 'expo-router';
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
  const user = context?.user

  const CurrentRole = () => {
    const [isDriver, setIsDriver] = useState(false);
    const [role, setRole] = useState(contextRole);

    console.log("role");
    console.log(contextRole);

    console.log("isDriver");
    console.log(isDriver);


    let textRole
    if (contextRole) {
      textRole = role == 'Passenger' ? 'Pasajero' : 'Driver'
    }
    const handleChangeRol = () => {
      const newRole = role == 'Driver' ? 'Passenger' : 'Driver'
      setRole(newRole)
      setIsDriver(role == 'Driver' ? false : true)
      context?.setRole(newRole)
    }

    return (
      <View className='flex flex-row justify-center items-center gap-3'>
        <Text className='text-foreground text-lg'>Rol: {textRole}</Text>
        <Switch onCheckedChange={handleChangeRol} checked={isDriver} />
      </View>
    )
  }
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: "#ccc" },
      headerRight: () => (<CurrentRole />)
    }}>
      <Stack.Screen name="profile" options={{ headerShown: true, title: 'Perfil' }} />
      <Stack.Screen name="createVehicle" options={{ headerShown: true, presentation: 'modal', title: 'Registar vehículo' }} />
    </Stack>
  );
}