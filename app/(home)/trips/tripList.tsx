import { Trips } from "@/types/types";
import React, { useEffect, useState, useContext } from "react";
import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { API_URL } from "@/constants/const";
import { getAllTrips } from "@/services/trip";
import { GlobalContext } from "@/utils/Provider";
import { Button } from "@/components/buttons/Button";

export default function TripsScreen() {
  const context = useContext(GlobalContext);
  const [trips, setTrips] = useState<Trips>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  // Inicializa el router

  useEffect(() => {
    const getTrips = async () => {
      const trips = await getAllTrips()
      setLoading(false)
      if (trips) setTrips(trips)
    }
    setLoading(true)
    getTrips()
  }, []);

  if (loading) {
    return (
      <View className="bg-background flex items-center justify-center h-full pl-5 pr-5">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="bg-background flex items-center justify-center h-full p-5">
      <Text className="text-foreground font-semibold text-2xl mb-4">Lista de viajes</Text>
      <FlatList
        className="w-full"
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/trips/detail/${item.id}`)} className="p-4 bg-card mb-6 w-full rounded-lg shadow-lg">
            <Text className="text-foreground text-lg font-bold">
              Desde: {item.departure_address.locality.principal_subdivision.name} - {item.departure_address.locality.name} - {item.departure_address.street} {item.departure_address.number}
            </Text>
            <Text className="text-foreground text-lg font-bold">
              Hasta: {item.arrival_address.locality.principal_subdivision.name} - {item.arrival_address.locality.name} - {item.arrival_address.street} {item.arrival_address.number}
            </Text>
            <Text className="text-foreground text-sm">
              Hora de salida: {item.departure_time}
            </Text>
            <Text className="text-foreground text-sm">
              {/* da error pero funciona, hay que arreglar los tipos una vez que este definido vehicle_driver */}
              Conductor : {item.vehicle_driver.driver.user.first_name} {item.vehicle_driver.driver.user.last_name}
            </Text>
          </TouchableOpacity>
        )}
      />
      {context?.role === 'Driver' && (
        <Button className="w-52 bg-[#104736] text-stone-50" label="Crear viaje" onPress={() => router.push('/trips/createTrip')} />
      )}
    </View>
  );
}