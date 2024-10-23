import { Trips } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Importa el hook router para navegación
import { API_URL } from "@/constants/const";
import { getAllTrips } from "@/services/trip";

export default function TripsScreen() {
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
      <View className="bg-slate-400 flex items-center justify-center h-full pl-5 pr-5">
        <Text className="text-gray-200">Cargando viajes...</Text>
      </View>
    );
  }

  return (
    <View className="bg-slate-400 flex items-center justify-center h-full p-5">
      <Text className="text-gray-200 text-2xl mb-4">Lista de viajes</Text>
      <FlatList
        className="w-full"
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/trips/detail/${item.id}`)}>
            <View className="bg-white p-4 mb-4 w-full rounded-lg shadow-lg">
              <Text className="text-gray-800 text-lg font-bold">
                De:  {item.departure_address.city.province.name} - {item.departure_address.city.name} - {item.departure_address.street} {item.departure_address.number}
              </Text>
              <Text className="text-gray-800 text-lg font-bold">
                A: {item.arrival_address.city.province.name} - {item.arrival_address.city.name} - {item.arrival_address.street} {item.arrival_address.number}
              </Text>
              <Text className="text-gray-600 text-sm">
                Hora de salida: {item.departure_time}
              </Text>
              <Text className="text-gray-600 text-sm">
                {/* da error pero funciona, hay que arreglar los tipos una vez que este definido vehicle_driver */}
                Conductor : {item.vehicle_driver.driver.first_name} {item.vehicle_driver.driver.last_name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}