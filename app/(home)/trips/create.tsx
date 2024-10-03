import { View, Text } from "react-native";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";

export default function CreateTripScreen() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/(home)/home");
  };

  return (
    <View className="bg-gray-200 flex items-center justify-center h-screen pl-5 pr-5 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Pantalla de crear viaje
      </Text>
      <Text className="text-lg mb-5 text-slate-600 dark:text-slate-300">
        Aquí podrás crear un nuevo viaje.
      </Text>

      <Button
        className="w-40"
        label="Volver al inicio"
        onPress={handleBackToHome}
      />
    </View>
  );
}
